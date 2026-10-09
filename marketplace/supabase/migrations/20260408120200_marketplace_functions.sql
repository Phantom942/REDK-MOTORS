-- Transitions de statut et anti-doublon (serveur)

create or replace function public.account_blocked(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.account_status in ('suspended', 'deleted', 'pending_deletion')
  );
$$;

create or replace function public.hash_registration(raw text)
returns text
language plpgsql
immutable
as $$
declare
  normalized text;
  pepper text := current_setting('app.registration_pepper', true);
begin
  if raw is null or btrim(raw) = '' then
    return null;
  end if;
  normalized := upper(regexp_replace(raw, '[^A-Z0-9]', '', 'g'));
  if pepper is null or pepper = '' then
    raise exception 'registration pepper not configured';
  end if;
  return encode(digest(normalized || pepper, 'sha256'), 'hex');
end;
$$;

create or replace function public.submit_listing_for_review(p_listing_id uuid)
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
  if l.status not in ('draft', 'rejected') then raise exception 'invalid_status'; end if;

  v := l.current_version + 1;

  insert into public.listing_versions (listing_id, version_number, snapshot, photo_manifest)
  values (
    l.id,
    v,
    to_jsonb(l) - 'moderation_notes_internal' - 'registration_fingerprint',
    (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'path', p.storage_path, 'hash', p.content_hash) order by p.sort_order), '[]'::jsonb)
     from public.listing_photos p where p.listing_id = l.id and p.version_number = l.current_version)
  );

  update public.listings
  set status = 'pending_review', pending_version = v, current_version = v, updated_at = now()
  where id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action)
  values (l.id, v, auth.uid(), 'submitted');
end;
$$;

-- Slug stable à la publication (appelé par edge function avec service role)
create or replace function public.assign_listing_slug(p_listing_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  base text;
  candidate text;
  n int := 0;
begin
  select * into l from public.listings where id = p_listing_id;
  base := lower(regexp_replace(l.make || '-' || l.model || '-' || l.model_year::text, '[^a-zA-Z0-9]+', '-', 'g'));
  base := trim(both '-' from base);
  loop
    candidate := base || case when n = 0 then '' else '-' || n::text end;
    exit when not exists (select 1 from public.listings where slug = candidate and id <> p_listing_id);
    n := n + 1;
  end loop;
  update public.listings set slug = candidate where id = p_listing_id;
  return candidate;
end;
$$;

revoke all on function public.submit_listing_for_review(uuid) from public;
grant execute on function public.submit_listing_for_review(uuid) to authenticated;
