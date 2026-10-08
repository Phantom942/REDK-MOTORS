-- Storage : photos privées jusqu'à publication (bucket public = copies après modération)

-- Policies bucket listing-photos-private
create policy "private_owner_upload"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-photos-private'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "private_owner_read"
on storage.objects for select to authenticated
using (
  bucket_id = 'listing-photos-private'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_moderator(auth.uid())
  )
);

create policy "private_owner_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'listing-photos-private'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Bucket public : lecture anon OK ; écriture réservée service role (edge function publish)
-- Pas de policy insert pour authenticated sur listing-photos-public

create policy "public_read_published_photos"
on storage.objects for select to anon, authenticated
using (bucket_id = 'listing-photos-public');
