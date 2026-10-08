import { getSupabase } from "./client.js";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIN_PHOTOS = 3;
const MAX_PHOTOS = 12;

export { MIN_PHOTOS, MAX_PHOTOS };

export async function stripImageMetadata(file) {
  if (!ALLOWED.has(file.type)) throw new Error("invalid_type");
  if (file.size > MAX_BYTES) throw new Error("too_large");

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode_failed"))),
      "image/webp",
      0.88,
    );
  });

  if (blob.size > MAX_BYTES) throw new Error("too_large_after_encode");
  return blob;
}

async function sha256Hex(blob) {
  const buf = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function uploadListingPhoto(listingId, file, sortOrder) {
  const supabase = getSupabase();
  const blob = await stripImageMetadata(file);
  const photoId = crypto.randomUUID();
  const { data: sessionData } = await supabase.auth.getSession();
  const uid = sessionData.session?.user?.id;
  if (!uid) throw new Error("not_authenticated");

  const path = `${uid}/${listingId}/${photoId}.webp`;
  const contentHash = await sha256Hex(blob);

  const { error: upErr } = await supabase.storage.from("listing-photos-private").upload(path, blob, {
    contentType: "image/webp",
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data, error } = await supabase.rpc("register_listing_photo", {
    p_listing_id: listingId,
    p_storage_path: path,
    p_content_hash: contentHash,
    p_bytes: blob.size,
    p_width: null,
    p_height: null,
    p_sort_order: sortOrder,
  });
  if (error) {
    await supabase.storage.from("listing-photos-private").remove([path]);
    throw error;
  }
  return data;
}

export async function deleteListingPhoto(photoId) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("delete_listing_photo", { p_photo_id: photoId });
  if (error) throw error;
}

export async function loadListingPhotos(listingId, version) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("listing_photos")
    .select("id, storage_path, sort_order, version_number")
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
