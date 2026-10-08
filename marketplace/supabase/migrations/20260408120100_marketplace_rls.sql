-- RLS — marketplace RED-K MOTORS

alter table public.platform_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.consent_records enable row level security;
alter table public.listings enable row level security;
alter table public.listing_versions enable row level security;
alter table public.listing_photos enable row level security;
alter table public.moderation_events enable row level security;
alter table public.duplicate_flags enable row level security;
alter table public.listing_reports enable row level security;

-- Helpers rôles
create or replace function public.has_role(uid uuid, r public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles ur where ur.user_id = uid and ur.role = r);
$$;

create or replace function public.is_moderator(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(uid, 'moderator') or public.has_role(uid, 'admin');
$$;

-- platform_settings : lecture anon des clés non sensibles via vue future ; table admin only
create policy platform_settings_admin on public.platform_settings
  for all using (public.has_role(auth.uid(), 'admin'));

-- profiles
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);

create policy profiles_select_mod on public.profiles
  for select using (public.is_moderator(auth.uid()));

create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id and account_status = 'active')
  with check (auth.uid() = id);

-- user_roles : lecture propre ; modération admin uniquement via service role / edge
create policy user_roles_select_own on public.user_roles
  for select using (auth.uid() = user_id);

create policy user_roles_no_write on public.user_roles
  for all using (false);

-- consent_records
create policy consent_insert_own on public.consent_records
  for insert with check (auth.uid() = user_id);

create policy consent_select_own on public.consent_records
  for select using (auth.uid() = user_id);

create policy consent_select_admin on public.consent_records
  for select using (public.has_role(auth.uid(), 'admin'));

-- listings : propriétaire voit les siennes ; public via vue uniquement
create policy listings_select_own on public.listings
  for select using (
    auth.uid() = owner_id
    or public.is_moderator(auth.uid())
  );

create policy listings_insert_own on public.listings
  for insert with check (
    auth.uid() = owner_id
    and seller_type = 'private'
    and status = 'draft'
  );

create policy listings_update_own_draft on public.listings
  for update using (
    auth.uid() = owner_id
    and status in ('draft', 'rejected', 'pending_review')
  ) with check (
    auth.uid() = owner_id
    and status in ('draft', 'rejected', 'pending_review', 'withdrawn', 'sold')
    and seller_type = 'private'
  );

-- Interdit UPDATE direct vers published / consignment par client (edge functions only)
create policy listings_no_publish_by_user on public.listings
  as restrictive for update using (
    not (
      auth.uid() = owner_id
      and (
        status = 'published'
        or seller_type = 'consignment'
      )
    )
  );

-- listing_versions / photos : owner + mod
create policy listing_versions_owner on public.listing_versions
  for select using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
    or public.is_moderator(auth.uid())
  );

create policy listing_photos_owner on public.listing_photos
  for select using (
    exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
    or public.is_moderator(auth.uid())
  );

create policy listing_photos_insert_owner on public.listing_photos
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid() and l.status in ('draft', 'rejected', 'pending_review')
    )
  );

-- moderation_events : mod read ; insert via service
create policy moderation_mod_read on public.moderation_events
  for select using (public.is_moderator(auth.uid()));

create policy duplicate_flags_mod on public.duplicate_flags
  for select using (public.is_moderator(auth.uid()));

-- reports : utilisateur connecté peut signaler
create policy reports_insert_auth on public.listing_reports
  for insert with check (auth.uid() is not null);

create policy reports_mod on public.listing_reports
  for select using (public.is_moderator(auth.uid()));

-- Vue publique : accès anon
grant select on public.listings_public to anon, authenticated;
