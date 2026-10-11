-- Aligner les photos sur pending_version à la soumission

create or replace function public.submit_listing_for_review(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  v int;
  old_v int;
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

  old_v := l.current_version;

  select count(*) into photo_cnt
  from public.listing_photos
  where listing_id = l.id and version_number = old_v and server_verified = true;

  if photo_cnt < min_p then raise exception 'min_photos_required'; end if;

  select count(*) into bad_cnt
  from public.listing_photos
  where listing_id = l.id and version_number = old_v and server_verified = false;
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

  v := old_v + 1;

  insert into public.listing_versions (listing_id, version_number, snapshot, photo_manifest)
  values (
    l.id,
    v,
    to_jsonb(l) - 'moderation_notes_internal' - 'registration_fingerprint',
    (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'path', p.storage_path, 'hash', p.content_hash) order by p.sort_order), '[]'::jsonb)
     from public.listing_photos p where p.listing_id = l.id and p.version_number = old_v and p.server_verified = true)
  );

  update public.listing_photos
  set version_number = v
  where listing_id = l.id and version_number = old_v;

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set status = 'pending_review', pending_version = v, current_version = v, updated_at = now()
  where id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, v, auth.uid(), 'submitted');
end;
$$;
