/**
 * Copie photos privées → bucket public après contrôle modérateur.
 * Chemins publics : {listing_id}/{version}/{photo_id}.webp (non devinables sans ID).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Body = { listingId: string; versionNumber: number };

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !supabaseUrl) {
    return new Response(JSON.stringify({ error: "misconfigured" }), { status: 500 });
  }

  const internalSecret = Deno.env.get("MARKETPLACE_INTERNAL_SECRET");
  const headerSecret = req.headers.get("X-Marketplace-Internal");
  if (!internalSecret || headerSecret !== internalSecret) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  const body = (await req.json()) as Body;
  if (!body.listingId || !body.versionNumber) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: listing, error: lErr } = await admin
    .from("listings")
    .select("id, status, pending_version")
    .eq("id", body.listingId)
    .single();

  if (lErr || !listing) {
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });
  }

  if (listing.status !== "pending_review" || listing.pending_version !== body.versionNumber) {
    return new Response(JSON.stringify({ error: "stale_version" }), { status: 409 });
  }

  const { data: photos, error: pErr } = await admin
    .from("listing_photos")
    .select("id, storage_path, version_number")
    .eq("listing_id", body.listingId)
    .eq("version_number", body.versionNumber)
    .order("sort_order");

  if (pErr || !photos?.length) {
    return new Response(JSON.stringify({ error: "photos_required" }), { status: 400 });
  }

  const copiedPublic: string[] = [];

  try {
    for (const ph of photos) {
      const { data: blob, error: dlErr } = await admin.storage
        .from("listing-photos-private")
        .download(ph.storage_path);
      if (dlErr || !blob) throw new Error("download_failed");

      const publicPath = `${body.listingId}/${body.versionNumber}/${ph.id}.webp`;
      const { error: upErr } = await admin.storage
        .from("listing-photos-public")
        .upload(publicPath, blob, { contentType: "image/webp", upsert: false });
      if (upErr) throw upErr;

      copiedPublic.push(publicPath);

      const { error: updErr } = await admin
        .from("listing_photos")
        .update({ public_storage_path: publicPath, published_version: body.versionNumber })
        .eq("id", ph.id);
      if (updErr) throw updErr;
    }
  } catch (e) {
    for (const path of copiedPublic) {
      await admin.storage.from("listing-photos-public").remove([path]);
    }
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, count: photos.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
