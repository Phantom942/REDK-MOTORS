import { getSupabase } from "./client.js";
import { readMarketplaceConfig } from "./config.js";

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 12;

export { MIN_PHOTOS, MAX_PHOTOS };

export async function uploadListingPhoto(listingId, file, sortOrder) {
  const supabase = getSupabase();
  const cfg = readMarketplaceConfig();
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("not_authenticated");

  const form = new FormData();
  form.set("listingId", listingId);
  form.set("sortOrder", String(sortOrder));
  form.set("file", file);

  const res = await fetch(`${cfg.supabaseUrl}/functions/v1/process-listing-photo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: cfg.supabaseAnonKey,
    },
    body: form,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error ?? "upload_failed");
  }
  return body.photoId;
}

export async function deleteListingPhoto(photoId) {
  const supabase = getSupabase();
  const { data: path, error } = await supabase.rpc("delete_listing_photo", { p_photo_id: photoId });
  if (error) throw error;
  if (path) {
    await supabase.storage.from("listing-photos-private").remove([path]);
  }
}

export async function loadListingPhotos(listingId, version) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("listing_photos")
    .select("id, storage_path, sort_order, version_number, server_verified")
    .eq("listing_id", listingId)
    .eq("version_number", version)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function signedPhotoUrl(storagePath) {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage
    .from("listing-photos-private")
    .createSignedUrl(storagePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export function publicPhotoUrl(photoId) {
  const cfg = readMarketplaceConfig();
  return `${cfg.supabaseUrl}/functions/v1/serve-listing-photo?photoId=${encodeURIComponent(photoId)}`;
}

export async function reorderListingPhotos(listingId, photoIdsInOrder) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("reorder_listing_photos", {
    p_listing_id: listingId,
    p_photo_ids: photoIdsInOrder,
  });
  if (error) throw error;
}
