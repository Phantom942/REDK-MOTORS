-- Photos : enregistrement serveur, prérequis soumission, vue publique sans chemins privés

alter table public.listing_photos
  add column if not exists public_storage_path text,
  add column if not exists published_version int;

create or replace function public.listing_photo_limits()
returns jsonb
language sql
stable
as $$
  select coalesce(
    (select value from public.platform_settings where key = 'limits'),
    '{"max_photos_per_listing": 12, "min_photos_to_submit": 3, "max_photo_bytes": 8388608}'::jsonb
  );
$$;

create or replace function public.register_listing_photo(
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
  uid uuid := auth.uid();
  prefix text;
  pid uuid := gen_random_uuid();
begin
  if uid is null then raise exception 'forbidden'; end if;

  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> uid then raise exception 'forbidden'; end if;
  if l.status not in ('draft', 'rejected') then raise exception 'listing_not_editable'; end if;
  if public.account_blocked(uid) then raise exception 'account_suspended'; end if;

  prefix := uid::text || '/' || p_listing_id::text || '/';
  if p_storage_path is null or p_storage_path not like prefix || '%' then
    raise exception 'invalid_storage_path';
  end if;
  if p_bytes is null or p_bytes <= 0 or p_bytes > 8388608 then
    raise exception 'invalid_photo_size';
  end if;

  lim := public.listing_photo_limits();
  max_p := (lim->>'max_photos_per_listing')::int;

  select count(*) into cnt
  from public.listing_photos
  where listing_id = p_listing_id and version_number = l.current_version;

  if cnt >= max_p then raise exception 'max_photos_reached'; end if;

  insert into public.listing_photos (
    id, listing_id, version_number, storage_path, sort_order, content_hash, width, height, bytes
  ) values (
    pid, p_listing_id, l.current_version, p_storage_path, coalesce(p_sort_order, cnt), p_content_hash, p_width, p_height, p_bytes
  );

  return pid;
end;
$$;

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
  if ph.public_storage_path is not null then
    raise exception 'published_photo_locked';
  end if;

  delete from public.listing_photos where id = p_photo_id;
  return ph.storage_path;
end;
$$;

create or replace function public.unpublish_listing_photos(p_listing_id uuid)
returns setof text
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with cleared as (
    update public.listing_photos
    set public_storage_path = null, published_version = null
    where listing_id = p_listing_id and public_storage_path is not null
    returning public_storage_path
  )
  select public_storage_path from cleared where public_storage_path is not null;
end;
$$;

revoke all on function public.unpublish_listing_photos(uuid) from public;
grant execute on function public.unpublish_listing_photos(uuid) to service_role;

create or replace view public.listing_public_photos as
select
  p.id,
  p.listing_id,
  l.slug as listing_slug,
  p.public_storage_path,
  p.sort_order
from public.listing_photos p
inner join public.listings l on l.id = p.listing_id
inner join public.profiles pr on pr.id = l.owner_id
where l.status = 'published'
  and pr.account_status = 'active'
  and p.public_storage_path is not null
  and (l.expires_at is null or l.expires_at > now());

grant select on public.listing_public_photos to anon, authenticated;

-- Soumission : minimum photos + verrou pending
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
  where listing_id = l.id and version_number = l.current_version;

  if photo_cnt < min_p then
    raise exception 'min_photos_required';
  end if;

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
     from public.listing_photos p where p.listing_id = l.id and p.version_number = l.current_version)
  );

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set status = 'pending_review', pending_version = v, current_version = v, updated_at = now()
  where id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, v, auth.uid(), 'submitted');
end;
$$;

create policy listing_photos_delete_owner on public.listing_photos
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('draft', 'rejected')
    )
  );

revoke all on function public.register_listing_photo(uuid, text, text, int, int, int, int) from public;
revoke all on function public.delete_listing_photo(uuid) from public;
grant execute on function public.register_listing_photo(uuid, text, text, int, int, int, int) to authenticated;
grant execute on function public.delete_listing_photo(uuid) to authenticated;

-- Retrait vendeur
create or replace function public.withdraw_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> auth.uid() then raise exception 'forbidden'; end if;
  if l.status <> 'published' then raise exception 'invalid_status'; end if;

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set status = 'withdrawn', withdrawn_at = now(), slug = null, published_at = null
  where id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, l.current_version, auth.uid(), 'withdrawn');
end;
$$;

revoke all on function public.withdraw_listing(uuid) from public;
grant execute on function public.withdraw_listing(uuid) to authenticated;
