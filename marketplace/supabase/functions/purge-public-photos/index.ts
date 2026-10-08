import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Body = { listingId: string };

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const internalSecret = Deno.env.get("MARKETPLACE_INTERNAL_SECRET");
  if (req.headers.get("X-Marketplace-Internal") !== internalSecret) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  const { listingId } = (await req.json()) as Body;
  if (!listingId) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: paths, error } = await admin.rpc("unpublish_listing_photos", {
    p_listing_id: listingId,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const toRemove = (paths ?? []).filter(Boolean) as string[];
  if (toRemove.length) {
    await admin.storage.from("listing-photos-public").remove(toRemove);
  }

  return new Response(JSON.stringify({ ok: true, removed: toRemove.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
