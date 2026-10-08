-- Approbation / refus via RPC (service role + vérif modérateur côté edge)

create or replace function public.apply_listing_rejection(
  p_listing_id uuid,
  p_version int,
  p_actor uuid,
  p_public_reason text,
  p_internal_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if l.status <> 'pending_review' or l.pending_version <> p_version then
    raise exception 'stale_version';
  end if;

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set
    status = 'rejected',
    rejection_reason_public = p_public_reason,
    moderation_notes_internal = p_internal_note,
    pending_version = null
  where id = p_listing_id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action, public_reason, internal_note)
  values (p_listing_id, p_version, p_actor, 'rejected', p_public_reason, p_internal_note);
end;
$$;

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
begin
  select * into l from public.listings where id = p_listing_id for update;
  if l.status <> 'pending_review' or l.pending_version <> p_version then
    raise exception 'stale_version';
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

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (p_listing_id, p_version, p_actor, 'approved', p_internal_note);

  return slug;
end;
$$;

revoke all on function public.apply_listing_rejection(uuid, int, uuid, text, text) from public;
revoke all on function public.apply_listing_approval(uuid, int, uuid, text) from public;
grant execute on function public.apply_listing_rejection(uuid, int, uuid, text, text) to service_role;
grant execute on function public.apply_listing_approval(uuid, int, uuid, text) to service_role;
