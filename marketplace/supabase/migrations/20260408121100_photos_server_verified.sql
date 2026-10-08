-- Photos : traitement serveur obligatoire, publication sans bucket public (distribution via edge)

alter table public.listing_photos
  add column if not exists server_verified boolean not null default false,
  add column if not exists verified_at timestamptz;

-- Les lignes legacy non vérifiées ne peuvent pas être soumises
update public.listing_photos set server_verified = false where server_verified is null;

create or replace function public.register_verified_listing_photo(
  p_owner_id uuid,
  p_listing_id uuid,
  p_storage_path text,
  p_content_hash text,
  p_bytes int,
  p_width int,
  p_height int,
  p_sort_order int
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  lim jsonb;
  max_p int;
  cnt int;
  prefix text;
  pid uuid := gen_random_uuid();
  max_bytes int;
  max_pixels bigint;
  max_dim int;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> p_owner_id then raise exception 'forbidden'; end if;
  if l.status not in ('draft', 'rejected') then raise exception 'listing_not_editable'; end if;
  if public.account_blocked(p_owner_id) then raise exception 'account_suspended'; end if;

  prefix := p_owner_id::text || '/' || p_listing_id::text || '/';
  if p_storage_path is null or p_storage_path not like prefix || '%' then
    raise exception 'invalid_storage_path';
  end if;

  lim := public.listing_photo_limits();
  max_bytes := coalesce((lim->>'max_photo_bytes')::int, 8388608);
  max_pixels := coalesce((lim->>'max_pixels')::bigint, 16000000);
  max_dim := coalesce((lim->>'max_dimension_px')::int, 4096);

  if p_bytes is null or p_bytes <= 0 or p_bytes > max_bytes then
    raise exception 'invalid_photo_size';
  end if;
  if p_width is null or p_height is null or p_width <= 0 or p_height <= 0 then
    raise exception 'invalid_dimensions';
  end if;
  if p_width::bigint * p_height::bigint > max_pixels then
    raise exception 'max_pixels_exceeded';
  end if;
  if p_width > max_dim or p_height > max_dim then
    raise exception 'max_dimension_exceeded';
  end if;

  max_p := coalesce((lim->>'max_photos_per_listing')::int, 12);
  select count(*) into cnt
  from public.listing_photos
  where listing_id = p_listing_id and version_number = l.current_version;
  if cnt >= max_p then raise exception 'max_photos_reached'; end if;

  insert into public.listing_photos (
    id, listing_id, version_number, storage_path, sort_order, content_hash,
    width, height, bytes, server_verified, verified_at
  ) values (
    pid, p_listing_id, l.current_version, p_storage_path, coalesce(p_sort_order, cnt),
    p_content_hash, p_width, p_height, p_bytes, true, now()
  );

  return pid;
end;
$$;

revoke all on function public.register_listing_photo(uuid, text, text, int, int, int, int) from authenticated;
revoke all on function public.register_verified_listing_photo(uuid, uuid, text, text, int, int, int, int) from public;
grant execute on function public.register_verified_listing_photo(uuid, uuid, text, text, int, int, int, int) to service_role;

-- Soumission : photos vérifiées serveur uniquement
create or replace function public.submit_listing_for_review(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  v int;
  dup_id uuid;
  lim jsonb;
  min_p int;
  photo_cnt int;
  bad_cnt int;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> auth.uid() then raise exception 'forbidden'; end if;
  if public.account_blocked(l.owner_id) then raise exception 'account_suspended'; end if;
  if l.status not in ('draft', 'rejected') then raise exception 'invalid_status'; end if;

  lim := public.listing_photo_limits();
  min_p := coalesce((lim->>'min_photos_to_submit')::int, 3);

  select count(*) into photo_cnt
  from public.listing_photos
  where listing_id = l.id and version_number = l.current_version and server_verified = true;

  if photo_cnt < min_p then raise exception 'min_photos_required'; end if;

  select count(*) into bad_cnt
  from public.listing_photos
  where listing_id = l.id and version_number = l.current_version and server_verified = false;
  if bad_cnt > 0 then raise exception 'unverified_photos'; end if;

  if l.registration_fingerprint is not null then
    select id into dup_id
    from public.listings
    where registration_fingerprint = l.registration_fingerprint
      and id <> l.id
      and status in ('published', 'pending_review')
    limit 1
    for update;
    if dup_id is not null then
      insert into public.duplicate_flags (listing_id, matched_listing_id, severity, signals)
      values (l.id, dup_id, 'blocked', jsonb_build_object('reason', 'registration_fingerprint'));
      raise exception 'duplicate_vehicle_blocked';
    end if;
  end if;

  v := l.current_version + 1;

  insert into public.listing_versions (listing_id, version_number, snapshot, photo_manifest)
  values (
    l.id,
    v,
    to_jsonb(l) - 'moderation_notes_internal' - 'registration_fingerprint',
    (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'path', p.storage_path, 'hash', p.content_hash) order by p.sort_order), '[]'::jsonb)
     from public.listing_photos p where p.listing_id = l.id and p.version_number = l.current_version and p.server_verified = true)
  );

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set status = 'pending_review', pending_version = v, current_version = v, updated_at = now()
  where id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, v, auth.uid(), 'submitted');
end;
$$;

-- Approbation : marque la version affichable (pas de copie bucket public)
create or replace function public.apply_listing_approval(
  p_listing_id uuid,
  p_version int,
  p_actor uuid,
  p_internal_note text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  slug text;
  photo_cnt int;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if l.status <> 'pending_review' or l.pending_version <> p_version then
    raise exception 'stale_version';
  end if;

  select count(*) into photo_cnt
  from public.listing_photos
  where listing_id = p_listing_id
    and version_number = p_version
    and server_verified = true;

  if photo_cnt < coalesce((public.listing_photo_limits()->>'min_photos_to_submit')::int, 3) then
    raise exception 'photos_not_ready';
  end if;

  perform set_config('app.marketplace_status_change', 'allow', true);

  slug := public.assign_listing_slug(p_listing_id);

  update public.listings
  set
    status = 'published',
    published_at = now(),
    rejection_reason_public = null,
    pending_version = null,
    slug = slug
  where id = p_listing_id;

  update public.listing_photos
  set published_version = p_version, public_storage_path = null
  where listing_id = p_listing_id and version_number = p_version and server_verified = true;

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (p_listing_id, p_version, p_actor, 'approved', p_internal_note);

  return slug;
end;
$$;

create or replace view public.listing_public_photos as
select
  p.id,
  p.listing_id,
  l.slug as listing_slug,
  p.sort_order
from public.listing_photos p
inner join public.listings l on l.id = p.listing_id
inner join public.profiles pr on pr.id = l.owner_id
where l.status = 'published'
  and pr.account_status = 'active'
  and p.server_verified = true
  and p.published_version = l.current_version
  and p.version_number = l.current_version
  and (l.expires_at is null or l.expires_at > now());

-- Storage : plus d'upload direct client sur bucket privé (edge + service role)
drop policy if exists "private_owner_upload" on storage.objects;

insert into public.platform_settings (key, value)
values ('limits', '{"max_photos_per_listing": 12, "min_photos_to_submit": 3, "max_photo_bytes": 8388608, "max_pixels": 16000000, "max_dimension_px": 4096}'::jsonb)
on conflict (key) do update set value = public.platform_settings.value || excluded.value;

create or replace function public.delete_listing_photo(p_photo_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  ph public.listing_photos;
  l public.listings;
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'forbidden'; end if;

  select * into ph from public.listing_photos where id = p_photo_id for update;
  if not found then raise exception 'photo_not_found'; end if;

  select * into l from public.listings where id = ph.listing_id;
  if l.owner_id <> uid and not public.is_moderator(uid) then raise exception 'forbidden'; end if;
  if l.owner_id = uid and l.status not in ('draft', 'rejected') then
    raise exception 'listing_not_editable';
  end if;
  if ph.published_version is not null then
    raise exception 'published_photo_locked';
  end if;
  if ph.server_verified = false then
    raise exception 'photo_not_verified';
  end if;

  delete from public.listing_photos where id = p_photo_id;
  return ph.storage_path;
end;
$$;
