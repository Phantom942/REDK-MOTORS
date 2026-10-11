-- Fiche annonce publique : données complètes via RPC (pas d’exposition directe table listings)

create or replace function public.get_public_listing_by_slug(p_slug text)
returns json
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_row record;
  photos json;
  v_slug text := trim(p_slug);
begin
  if v_slug is null or length(v_slug) < 2 then
    return null;
  end if;

  select
    lst.id,
    lst.slug,
    lst.seller_type,
    lst.make,
    lst.model,
    lst.trim,
    lst.model_year,
    lst.mileage_km,
    lst.fuel,
    lst.gearbox,
    lst.price_cents,
    lst.city,
    lst.postal_code,
    lst.description,
    lst.contact_phone,
    lst.contact_whatsapp,
    case when lst.show_email then lst.contact_email else null end as contact_email,
    lst.published_at,
    lst.updated_at
  into v_row
  from public.listings lst
  inner join public.profiles p on p.id = lst.owner_id
  where lst.slug = v_slug
    and lst.status = 'published'
    and p.account_status = 'active'
    and (lst.expires_at is null or lst.expires_at > now());

  if not found then
    return null;
  end if;

  select coalesce(
    json_agg(
      json_build_object('id', ph.id, 'sort_order', ph.sort_order)
      order by ph.sort_order
    ),
    '[]'::json
  )
  into photos
  from public.listing_public_photos ph
  where ph.listing_slug = v_slug;

  return json_build_object(
    'listing', json_build_object(
      'id', v_row.id,
      'slug', v_row.slug,
      'seller_type', v_row.seller_type,
      'make', v_row.make,
      'model', v_row.model,
      'trim', v_row.trim,
      'model_year', v_row.model_year,
      'mileage_km', v_row.mileage_km,
      'fuel', v_row.fuel,
      'gearbox', v_row.gearbox,
      'price_cents', v_row.price_cents,
      'city', v_row.city,
      'postal_code', v_row.postal_code,
      'description', v_row.description,
      'contact_phone', v_row.contact_phone,
      'contact_whatsapp', v_row.contact_whatsapp,
      'contact_email', v_row.contact_email,
      'published_at', v_row.published_at,
      'updated_at', v_row.updated_at
    ),
    'photos', photos
  );
end;
$$;

revoke all on function public.get_public_listing_by_slug(text) from public;
grant execute on function public.get_public_listing_by_slug(text) to anon, authenticated;

-- URLs sitemap (annonces publiées uniquement) — activation côté build / Worker
create or replace function public.list_published_listing_sitemap_rows()
returns table (slug text, updated_at timestamptz)
language sql
security definer
stable
set search_path = public
as $$
  select l.slug, l.updated_at
  from public.listings l
  inner join public.profiles p on p.id = l.owner_id
  where l.status = 'published'
    and l.slug is not null
    and p.account_status = 'active'
    and (l.expires_at is null or l.expires_at > now())
  order by l.updated_at desc;
$$;

revoke all on function public.list_published_listing_sitemap_rows() from public;
grant execute on function public.list_published_listing_sitemap_rows() to anon, authenticated;
