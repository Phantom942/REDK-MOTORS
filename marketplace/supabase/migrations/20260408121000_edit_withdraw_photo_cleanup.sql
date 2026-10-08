-- Retrait / édition : retirer les références publiques (purge storage via edge purge-public-photos)

create or replace function public.begin_edit_published_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  v int;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> auth.uid() then raise exception 'forbidden'; end if;
  if public.account_blocked(l.owner_id) then raise exception 'account_suspended'; end if;
  if l.status <> 'published' then raise exception 'not_published'; end if;

  v := l.current_version + 1;
  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set
    status = 'draft',
    pending_version = v,
    current_version = v,
    published_at = null,
    slug = null
  where id = l.id;

  update public.listing_photos
  set public_storage_path = null, published_version = null
  where listing_id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (l.id, v, auth.uid(), 'submitted', 'owner_began_edit_after_publish');
end;
$$;

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

  update public.listing_photos
  set public_storage_path = null, published_version = null
  where listing_id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, l.current_version, auth.uid(), 'withdrawn');
end;
$$;

drop policy if exists listing_photos_insert_owner on public.listing_photos;
