-- Suspension : autoriser mise à jour profil ; vendu via RPC propriétaire

create or replace function public.suspend_account(p_user_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'forbidden';
  end if;

  perform set_config('app.marketplace_profile_admin', 'allow', true);
  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.profiles
  set account_status = 'suspended', suspended_at = now(), suspended_reason = p_reason
  where id = p_user_id;

  update public.listings
  set status = 'withdrawn', withdrawn_at = now(), slug = null, published_at = null
  where owner_id = p_user_id and status = 'published';

  update public.listing_photos
  set public_storage_path = null, published_version = null
  where listing_id in (
    select id from public.listings where owner_id = p_user_id and status = 'withdrawn'
  );

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  select l.id, l.current_version, auth.uid(), 'suspended_owner', p_reason
  from public.listings l
  where l.owner_id = p_user_id and l.withdrawn_at >= now() - interval '2 seconds';
end;
$$;

create or replace function public.mark_listing_sold(p_listing_id uuid)
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
  set status = 'sold', sold_at = now(), slug = null, published_at = null
  where id = l.id;

  update public.listing_photos
  set published_version = null, public_storage_path = null
  where listing_id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, l.current_version, auth.uid(), 'sold');
end;
$$;

revoke all on function public.mark_listing_sold(uuid) from public;
grant execute on function public.mark_listing_sold(uuid) to authenticated;
