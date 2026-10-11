-- Panel admin : dépôt-vente staff + retrait modérateur

create or replace function public.create_consignment_listing(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  owner uuid;
begin
  if not public.is_garage_staff(auth.uid()) then
    raise exception 'forbidden';
  end if;

  owner := coalesce((p_payload->>'owner_id')::uuid, auth.uid());
  if owner <> auth.uid() and not public.has_role(auth.uid(), 'admin') then
    raise exception 'forbidden_owner';
  end if;
  if not public.is_garage_staff(owner) then
    raise exception 'owner_must_be_staff';
  end if;

  perform set_config('app.marketplace_internal_set', 'allow', true);

  insert into public.listings (
    owner_id,
    seller_type,
    status,
    make,
    model,
    trim,
    model_year,
    mileage_km,
    fuel,
    gearbox,
    price_cents,
    city,
    postal_code,
    description,
    contact_phone,
    contact_whatsapp,
    show_email,
    contact_email
  )
  values (
    owner,
    'consignment',
    'draft',
    nullif(trim(p_payload->>'make'), ''),
    nullif(trim(p_payload->>'model'), ''),
    nullif(trim(p_payload->>'trim'), ''),
    (p_payload->>'model_year')::int,
    (p_payload->>'mileage_km')::int,
    (p_payload->>'fuel')::public.fuel_type,
    (p_payload->>'gearbox')::public.gearbox_type,
    (p_payload->>'price_cents')::int,
    nullif(trim(p_payload->>'city'), ''),
    nullif(trim(p_payload->>'postal_code'), ''),
    nullif(trim(p_payload->>'description'), ''),
    nullif(trim(p_payload->>'contact_phone'), ''),
    nullif(trim(p_payload->>'contact_whatsapp'), ''),
    coalesce((p_payload->>'show_email')::boolean, false),
    nullif(trim(p_payload->>'contact_email'), '')
  )
  returning id into new_id;

  perform public.log_admin_action('consignment_created', 'listing', new_id, jsonb_build_object('owner_id', owner));

  return new_id;
end;
$$;

revoke all on function public.create_consignment_listing(jsonb) from public;
grant execute on function public.create_consignment_listing(jsonb) to authenticated;

create or replace function public.admin_withdraw_listing(p_listing_id uuid, p_internal_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
begin
  if not public.is_moderator(auth.uid()) then
    raise exception 'forbidden';
  end if;

  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.status <> 'published' then raise exception 'invalid_status'; end if;

  perform set_config('app.marketplace_status_change', 'allow', true);

  update public.listings
  set status = 'withdrawn', withdrawn_at = now(), slug = null, published_at = null
  where id = l.id;

  update public.listing_photos
  set public_storage_path = null, published_version = null
  where listing_id = l.id;

  insert into public.moderation_events (listing_id, version_number, actor_id, action, internal_note)
  values (l.id, l.current_version, auth.uid(), 'withdrawn', coalesce(p_internal_note, 'admin_withdraw'));

  perform public.log_admin_action(
    'admin_withdraw_listing',
    'listing',
    p_listing_id,
    jsonb_build_object('owner_id', l.owner_id)
  );
end;
$$;

revoke all on function public.admin_withdraw_listing(uuid, text) from public;
grant execute on function public.admin_withdraw_listing(uuid, text) to authenticated;
