/**
 * Upload photo annonce — seul point d'entrée vendeur.
 * Décode, contrôle pixels/taille, réencode WebP sans métadonnées, stockage privé, ligne DB vérifiée.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const MAX_BYTES = 8_388_608;
const MAX_PIXELS = 16_000_000;
const MAX_DIM = 4096;

function sniffMime(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "png";
  }
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return "webp";
  }
  return null;
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: userRes, error: userErr } = await userClient.auth.getUser();
  const uid = userRes.user?.id;
  if (userErr || !uid) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const form = await req.formData();
  const listingId = String(form.get("listingId") ?? "").trim();
  const sortOrder = Number(form.get("sortOrder") ?? 0);
  const file = form.get("file");
  if (!listingId || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: listing, error: lErr } = await admin
    .from("listings")
    .select("id, owner_id, status, current_version")
    .eq("id", listingId)
    .single();

  if (lErr || !listing || listing.owner_id !== uid) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }
  if (!["draft", "rejected"].includes(listing.status)) {
    return new Response(JSON.stringify({ error: "listing_not_editable" }), { status: 409 });
  }

  if (file.size > MAX_BYTES) {
    return new Response(JSON.stringify({ error: "too_large" }), { status: 413 });
  }

  const raw = new Uint8Array(await file.arrayBuffer());
  if (raw.length > MAX_BYTES) {
    return new Response(JSON.stringify({ error: "too_large" }), { status: 413 });
  }
  if (!sniffMime(raw)) {
    return new Response(JSON.stringify({ error: "invalid_image" }), { status: 415 });
  }

  let img: Image;
  try {
    img = await decode(raw);
  } catch {
    return new Response(JSON.stringify({ error: "decode_failed" }), { status: 415 });
  }

  let { width, height } = img;
  if (width * height > MAX_PIXELS) {
    const scale = Math.sqrt(MAX_PIXELS / (width * height));
    width = Math.max(1, Math.floor(width * scale));
    height = Math.max(1, Math.floor(height * scale));
    img = img.resize(width, height);
  }
  if (width > MAX_DIM || height > MAX_DIM) {
    const scale = MAX_DIM / Math.max(width, height);
    width = Math.max(1, Math.floor(width * scale));
    height = Math.max(1, Math.floor(height * scale));
    img = img.resize(width, height);
  }

  const encoded = await img.encodeWEBP(88);
  if (encoded.length > MAX_BYTES) {
    return new Response(JSON.stringify({ error: "too_large_after_encode" }), { status: 413 });
  }

  const photoId = crypto.randomUUID();
  const path = `${uid}/${listingId}/${photoId}.webp`;
  const contentHash = await sha256Hex(encoded);

  const { error: upErr } = await admin.storage.from("listing-photos-private").upload(path, encoded, {
    contentType: "image/webp",
    upsert: false,
  });
  if (upErr) {
    return new Response(JSON.stringify({ error: "storage_failed", detail: upErr.message }), { status: 500 });
  }

  const { data: photoRowId, error: regErr } = await admin.rpc("register_verified_listing_photo", {
    p_owner_id: uid,
    p_listing_id: listingId,
    p_storage_path: path,
    p_content_hash: contentHash,
    p_bytes: encoded.length,
    p_width: width,
    p_height: height,
    p_sort_order: sortOrder,
  });

  if (regErr) {
    await admin.storage.from("listing-photos-private").remove([path]);
    return new Response(JSON.stringify({ error: regErr.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true, photoId: photoRowId, path }), {
    headers: { "Content-Type": "application/json" },
  });
});
