-- Aligner contrôle rôle dépôt-vente sur has_role (garage_staff explicite)

create or replace function public.create_consignment_listing(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  owner uuid;
  caller uuid;
begin
  caller := auth.uid();
  if caller is null then
    raise exception 'forbidden';
  end if;

  if not (
    public.has_role(caller, 'garage_staff')
    or public.has_role(caller, 'admin')
  ) then
    raise exception 'forbidden';
  end if;

  owner := coalesce((p_payload->>'owner_id')::uuid, caller);
  if owner <> caller and not public.has_role(caller, 'admin') then
    raise exception 'forbidden_owner';
  end if;
  if not (
    public.has_role(owner, 'garage_staff')
    or public.has_role(owner, 'admin')
  ) then
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
