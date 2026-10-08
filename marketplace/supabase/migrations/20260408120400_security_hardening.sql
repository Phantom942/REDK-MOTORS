-- Durcissement sécurité marketplace

-- Vue publique : propriétaire actif uniquement, champs strictement publics
create or replace view public.listings_public as
select
  l.id,
  l.slug,
  l.seller_type,
  l.make,
  l.model,
  l.trim,
  l.model_year,
  l.mileage_km,
  l.fuel,
  l.gearbox,
  l.price_cents,
  l.city,
  l.postal_code,
  left(l.description, 280) as description_excerpt,
  l.contact_phone,
  l.contact_whatsapp,
  case when l.show_email then l.contact_email else null end as contact_email,
  l.published_at,
  l.updated_at
from public.listings l
inner join public.profiles p on p.id = l.owner_id
where l.status = 'published'
  and p.account_status = 'active'
  and (l.expires_at is null or l.expires_at > now());

revoke all on public.listings from anon;
revoke all on public.listing_photos from anon;
revoke all on public.listing_versions from anon;
revoke all on public.profiles from anon;
revoke all on public.user_roles from anon;
revoke all on public.moderation_events from anon;

-- Empêche changement de statut / seller_type côté client (sauf via fonctions autorisées)
create or replace function public.listings_block_status_escalation()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.marketplace_status_change', true) = 'allow' then
    return new;
  end if;

  if new.status is distinct from old.status then
    if new.status in ('published', 'pending_review') and old.status = 'published' then
      raise exception 'use_begin_edit_for_published';
    end if;
    if new.status = 'published' then
      raise exception 'publish_via_moderation_only';
    end if;
    if new.status = 'pending_review' and old.status not in ('draft', 'rejected') then
      raise exception 'invalid_transition_to_pending';
    end if;
  end if;

  if new.seller_type is distinct from old.seller_type then
    raise exception 'seller_type_locked';
  end if;

  if new.owner_id is distinct from old.owner_id then
    raise exception 'owner_locked';
  end if;

  return new;
end;
$$;

drop trigger if exists listings_guard_status on public.listings;
create trigger listings_guard_status
  before update on public.listings
  for each row execute function public.listings_block_status_escalation();

-- Propriétaire ne modifie plus en pending_review (modération en cours)
drop policy if exists listings_update_own_draft on public.listings;
create policy listings_update_own_draft on public.listings
  for update using (
    auth.uid() = owner_id
    and status in ('draft', 'rejected')
  ) with check (
    auth.uid() = owner_id
    and status in ('draft', 'rejected', 'withdrawn', 'sold')
    and seller_type = 'private'
  );

-- Retrait / vendu par le propriétaire (depuis published via fonction dédiée pour edit)
create policy listings_update_own_published_lifecycle on public.listings
  for update using (
    auth.uid() = owner_id
    and status = 'published'
  ) with check (
    auth.uid() = owner_id
    and status in ('withdrawn', 'sold')
    and seller_type = 'private'
  );

-- Modification annonce publiée → repasse en modération (retrait catalogue)
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

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (l.id, v, auth.uid(), 'submitted', 'owner_began_edit_after_publish');
end;
$$;

revoke all on function public.begin_edit_published_listing(uuid) from public;
grant execute on function public.begin_edit_published_listing(uuid) to authenticated;

-- Suspension : masque annonces, ne republie pas à la réactivation
create or replace function public.suspend_account(p_user_id uuid, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator(auth.uid()) then
    raise exception 'forbidden';
  end if;

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.profiles
  set account_status = 'suspended', suspended_at = now(), suspended_reason = p_reason
  where id = p_user_id;

  update public.listings
  set status = 'withdrawn', withdrawn_at = now()
  where owner_id = p_user_id and status = 'published';

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  select l.id, l.current_version, auth.uid(), 'suspended_owner', p_reason
  from public.listings l
  where l.owner_id = p_user_id and l.withdrawn_at >= now() - interval '1 second';
end;
$$;

create or replace function public.reactivate_account(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'forbidden';
  end if;

  update public.profiles
  set account_status = 'active', suspended_at = null, suspended_reason = null
  where id = p_user_id;
  -- Les annonces restent withdrawn : pas de republish auto
end;
$$;

revoke all on function public.suspend_account(uuid, text) from public;
revoke all on function public.reactivate_account(uuid) from public;
grant execute on function public.suspend_account(uuid, text) to authenticated;
grant execute on function public.reactivate_account(uuid) to authenticated;

-- Soumission : verrouillage doublons basique (empreinte + owner actif)
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
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> auth.uid() then raise exception 'forbidden'; end if;
  if public.account_blocked(l.owner_id) then raise exception 'account_suspended'; end if;
  if l.status not in ('draft', 'rejected') then raise exception 'invalid_status'; end if;

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

-- Bootstrap flag (désactivable après 1er admin)
insert into public.platform_settings (key, value)
values ('bootstrap', '{"admin_bootstrap_enabled": true}'::jsonb)
on conflict (key) do nothing;
