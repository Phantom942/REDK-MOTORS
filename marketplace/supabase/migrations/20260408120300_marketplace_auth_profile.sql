-- Profil auto à l'inscription + bucket storage

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage buckets (paths: {user_id}/{listing_id}/{photo_id}.webp)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-photos-private', 'listing-photos-private', false, 8388608, array['image/jpeg', 'image/webp', 'image/png']),
  ('listing-photos-public', 'listing-photos-public', true, 8388608, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do nothing;
