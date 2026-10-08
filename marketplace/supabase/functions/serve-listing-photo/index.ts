/**
 * Distribution publique des photos publiées — bucket privé, contrôle statut + version.
 * Cache court : retrait effectif sous TTL (60s par défaut).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const CACHE_SECONDS = 60;

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("method_not_allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const photoId = url.searchParams.get("photoId")?.trim();
  if (!photoId) {
    return new Response("bad_request", { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: row, error } = await admin
    .from("listing_public_photos")
    .select("id, listing_id")
    .eq("id", photoId)
    .maybeSingle();

  if (error || !row) {
    return new Response("not_found", {
      status: 404,
      headers: { "Cache-Control": "no-store, private", "CDN-Cache-Control": "no-store" },
    });
  }

  const { data: photo, error: pErr } = await admin
    .from("listing_photos")
    .select("storage_path")
    .eq("id", photoId)
    .single();

  if (pErr || !photo?.storage_path) {
    return new Response("not_found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const { data: blob, error: dlErr } = await admin.storage
    .from("listing-photos-private")
    .download(photo.storage_path);

  if (dlErr || !blob) {
    return new Response("not_found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(blob.stream(), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
});
