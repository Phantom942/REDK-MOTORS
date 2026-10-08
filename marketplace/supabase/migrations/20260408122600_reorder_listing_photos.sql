-- Réordonnancement photos (brouillon / refusé) par le propriétaire

create or replace function public.reorder_listing_photos(p_listing_id uuid, p_photo_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  l public.listings;
  i int;
  pid uuid;
begin
  select * into l from public.listings where id = p_listing_id for update;
  if not found then raise exception 'listing_not_found'; end if;
  if l.owner_id <> auth.uid() then raise exception 'forbidden'; end if;
  if l.status not in ('draft', 'rejected') then raise exception 'invalid_status'; end if;

  if p_photo_ids is null or array_length(p_photo_ids, 1) is null then
    raise exception 'empty_order';
  end if;

  i := 0;
  foreach pid in array p_photo_ids loop
    update public.listing_photos
    set sort_order = i
    where id = pid
      and listing_id = p_listing_id
      and version_number = l.current_version;
    if not found then
      raise exception 'photo_not_in_listing';
    end if;
    i := i + 1;
  end loop;
end;
$$;

revoke all on function public.reorder_listing_photos(uuid, uuid[]) from public;
grant execute on function public.reorder_listing_photos(uuid, uuid[]) to authenticated;
