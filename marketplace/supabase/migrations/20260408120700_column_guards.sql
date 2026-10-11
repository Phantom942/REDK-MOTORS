-- Empêche l'escalade via UPDATE profil ou champs sensibles sur listings

create or replace function public.profiles_block_privileged_updates()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.marketplace_profile_admin', true) = 'allow' then
    return new;
  end if;

  if new.account_status is distinct from old.account_status then
    raise exception 'account_status_locked';
  end if;
  if new.suspended_at is distinct from old.suspended_at
     or new.suspended_reason is distinct from old.suspended_reason then
    raise exception 'suspension_fields_locked';
  end if;
  if new.deletion_requested_at is distinct from old.deletion_requested_at then
    raise exception 'deletion_fields_locked';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_privileged on public.profiles;
create trigger profiles_guard_privileged
  before update on public.profiles
  for each row execute function public.profiles_block_privileged_updates();

create or replace function public.listings_block_sensitive_columns()
returns trigger
language plpgsql
as $$
begin
  if current_setting('app.marketplace_internal_set', true) = 'allow' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.registration_fingerprint is not null then
      raise exception 'registration_fingerprint_locked';
    end if;
    if new.moderation_notes_internal is not null then
      raise exception 'moderation_notes_locked';
    end if;
    if new.seller_type <> 'private' then
      raise exception 'seller_type_private_only';
    end if;
    if new.status <> 'draft' then
      raise exception 'initial_status_draft_only';
    end if;
    return new;
  end if;

  if new.registration_fingerprint is distinct from old.registration_fingerprint then
    raise exception 'registration_fingerprint_locked';
  end if;
  if new.moderation_notes_internal is distinct from old.moderation_notes_internal then
    raise exception 'moderation_notes_locked';
  end if;

  return new;
end;
$$;

drop trigger if exists listings_guard_sensitive on public.listings;
create trigger listings_guard_sensitive
  before insert or update on public.listings
  for each row execute function public.listings_block_sensitive_columns();
