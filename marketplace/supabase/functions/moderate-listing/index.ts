import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Body = {
  listingId: string;
  versionNumber: number;
  action: "approve" | "reject";
  publicReason?: string;
  internalNote?: string;
};

async function assertModerator(supabaseAdmin: ReturnType<typeof createClient>, uid: string) {
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", uid)
    .in("role", ["moderator", "admin"]);
  if (!roles?.length) {
    throw new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  if (!jwt) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: userRes, error: userErr } = await createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } },
  ).auth.getUser();

  const uid = userRes.user?.id;
  if (userErr || !uid) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  try {
    await assertModerator(supabaseAdmin, uid);
  } catch (resp) {
    return resp as Response;
  }

  const body = (await req.json()) as Body;
  const { listingId, versionNumber, action, publicReason, internalNote } = body;
  if (!listingId || !versionNumber || !action) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400 });
  }

  const { data: listing, error: lErr } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (lErr || !listing) {
    return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });
  }

  if (listing.status !== "pending_review") {
    return new Response(JSON.stringify({ error: "invalid_status" }), { status: 409 });
  }

  if (listing.pending_version !== versionNumber) {
    return new Response(JSON.stringify({ error: "stale_version" }), { status: 409 });
  }

  const { data: versionRow } = await supabaseAdmin
    .from("listing_versions")
    .select("version_number")
    .eq("listing_id", listingId)
    .eq("version_number", versionNumber)
    .maybeSingle();

  if (!versionRow) {
    return new Response(JSON.stringify({ error: "version_not_found" }), { status: 409 });
  }

  if (action === "reject") {
    const { error } = await supabaseAdmin.rpc("apply_listing_rejection", {
      p_listing_id: listingId,
      p_version: versionNumber,
      p_actor: uid,
      p_public_reason: publicReason ?? "Annonce non conforme.",
      p_internal_note: internalNote ?? null,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ ok: true, status: "rejected" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const internalSecret = Deno.env.get("MARKETPLACE_INTERNAL_SECRET");
  const functionsBase = `${Deno.env.get("SUPABASE_URL")}/functions/v1`;

  if (!internalSecret) {
    return new Response(JSON.stringify({ error: "misconfigured" }), { status: 500 });
  }

  const photoRes = await fetch(`${functionsBase}/publish-listing-photos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Marketplace-Internal": internalSecret,
    },
    body: JSON.stringify({ listingId, versionNumber }),
  });

  if (!photoRes.ok) {
    const errBody = await photoRes.text();
    return new Response(JSON.stringify({ error: "photo_publish_failed", detail: errBody }), {
      status: 502,
    });
  }

  const { data: slug, error: pubErr } = await supabaseAdmin.rpc("apply_listing_approval", {
    p_listing_id: listingId,
    p_version: versionNumber,
    p_actor: uid,
    p_internal_note: internalNote ?? null,
  });

  if (pubErr) {
    await fetch(`${functionsBase}/purge-public-photos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Marketplace-Internal": internalSecret,
      },
      body: JSON.stringify({ listingId }),
    });
    return new Response(JSON.stringify({ error: pubErr.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, status: "published", slug }), {
    headers: { "Content-Type": "application/json" },
  });
});
