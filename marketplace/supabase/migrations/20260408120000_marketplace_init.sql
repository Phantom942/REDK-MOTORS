-- RED-K MOTORS — marketplace véhicules (particuliers + dépôt-vente)
-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enums
create type public.app_role as enum ('user', 'moderator', 'garage_staff', 'admin');
create type public.account_status as enum ('active', 'suspended', 'pending_deletion', 'deleted');
create type public.listing_status as enum (
  'draft',
  'pending_review',
  'published',
  'rejected',
  'withdrawn',
  'sold',
  'expired'
);
create type public.seller_type as enum ('private', 'consignment');
create type public.fuel_type as enum ('essence', 'diesel', 'hybride', 'hybride_rechargeable', 'electrique', 'gpl', 'autre');
create type public.gearbox_type as enum ('manuelle', 'automatique', 'robotisee');
create type public.consent_channel as enum ('email_marketing', 'sms_marketing', 'whatsapp_marketing');
create type public.duplicate_severity as enum ('blocked', 'suspected');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- Paramètres plateforme (monétisation future)
create table public.platform_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (key, value) values
  ('publishing', '{"fee_enabled": false, "fee_cents": 0, "currency": "EUR"}'::jsonb),
  ('limits', '{"max_photos_per_listing": 12, "max_photo_bytes": 8388608, "max_active_listings_per_user": 5}'::jsonb),
  ('listing_ttl_days', '{"published": null}'::jsonb);

-- Profils (1:1 auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  city text,
  postal_code text,
  account_status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  suspended_at timestamptz,
  suspended_reason text,
  deletion_requested_at timestamptz
);

-- Rôles (table séparée — jamais modifiable par l'utilisateur via RLS UPDATE)
create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles (id),
  primary key (user_id, role)
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel public.consent_channel not null,
  granted boolean not null,
  consent_text_version text not null,
  consent_text_snapshot text not null,
  recorded_at timestamptz not null default now(),
  ip_hash text,
  user_agent text
);

create index consent_records_user_channel_idx on public.consent_records (user_id, channel, recorded_at desc);

-- Annonces (état courant)
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  seller_type public.seller_type not null default 'private',
  status public.listing_status not null default 'draft',
  slug text unique,
  -- véhicule
  make text not null,
  model text not null,
  trim text,
  model_year int not null check (model_year >= 1980 and model_year <= extract(year from now())::int + 1),
  mileage_km int not null check (mileage_km >= 0 and mileage_km <= 2000000),
  fuel public.fuel_type not null,
  gearbox public.gearbox_type not null,
  price_cents int not null check (price_cents > 0 and price_cents <= 500000000),
  city text not null,
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  description text not null check (char_length(description) between 40 and 8000),
  -- contact public (email compte jamais exposé par défaut)
  contact_phone text not null,
  contact_whatsapp text,
  show_email boolean not null default false,
  contact_email text,
  -- modération
  rejection_reason_public text,
  moderation_notes_internal text,
  published_at timestamptz,
  expires_at timestamptz,
  sold_at timestamptz,
  withdrawn_at timestamptz,
  current_version int not null default 1,
  pending_version int,
  -- anti-doublon privé (hash immatriculation normalisée — optionnel, jamais exposé)
  registration_fingerprint text,
  -- SEO / build statique
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_garage_staff(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = uid and ur.role in ('garage_staff', 'admin')
  );
$$;

alter table public.listings drop constraint if exists consignment_only_garage;
alter table public.listings add constraint consignment_only_garage check (
  seller_type <> 'consignment' or public.is_garage_staff(owner_id)
);

create index listings_status_published_idx on public.listings (status) where status = 'published';
create index listings_owner_idx on public.listings (owner_id);
create index listings_dup_fingerprint_idx on public.listings (registration_fingerprint) where registration_fingerprint is not null;

-- Versions immuables pour modération concurrente
create table public.listing_versions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  version_number int not null,
  snapshot jsonb not null,
  photo_manifest jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now(),
  unique (listing_id, version_number)
);

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  version_number int not null,
  storage_path text not null,
  sort_order int not null default 0,
  content_hash text not null,
  width int,
  height int,
  bytes int,
  created_at timestamptz not null default now(),
  unique (listing_id, storage_path)
);

create index listing_photos_listing_version_idx on public.listing_photos (listing_id, version_number, sort_order);

create table public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  version_number int not null,
  actor_id uuid not null references public.profiles (id),
  action text not null check (action in ('submitted', 'approved', 'rejected', 'withdrawn', 'sold', 'expired', 'suspended_owner')),
  public_reason text,
  internal_note text,
  created_at timestamptz not null default now()
);

create table public.duplicate_flags (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  matched_listing_id uuid references public.listings (id) on delete set null,
  severity public.duplicate_severity not null,
  score numeric(5,2),
  signals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id)
);

-- Vue publique (données minimales, annonces publiées uniquement)
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
  l.show_email,
  l.contact_email,
  l.published_at,
  l.updated_at
from public.listings l
where l.status = 'published'
  and (l.expires_at is null or l.expires_at > now());

-- Triggers updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger listings_updated_at before update on public.listings
for each row execute function public.set_updated_at();
