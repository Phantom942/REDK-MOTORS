-- Éviter slug = slug ambigu dans apply_listing_approval

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
  new_slug text;
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

  new_slug := public.assign_listing_slug(p_listing_id);

  update public.listings
  set
    status = 'published',
    published_at = now(),
    rejection_reason_public = null,
    pending_version = null,
    slug = new_slug
  where id = p_listing_id;

  update public.listing_photos
  set published_version = p_version, public_storage_path = null
  where listing_id = p_listing_id and version_number = p_version and server_verified = true;

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (p_listing_id, p_version, p_actor, 'approved', p_internal_note);

  return new_slug;
end;
$$;
