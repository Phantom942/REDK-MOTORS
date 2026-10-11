/**
 * Bootstrap admin — réservé opérateur (secret serveur + UUID cible).
 * Un visiteur aléatoire ne peut PAS devenir admin : pas de promotion du JWT appelant.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type Body = { userId?: string };

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const secret = Deno.env.get("MARKETPLACE_ADMIN_BOOTSTRAP_SECRET");
  const headerSecret = req.headers.get("X-Bootstrap-Secret");
  if (!secret || !headerSecret || headerSecret !== secret) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  let body: Body = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }

  const targetUserId = body.userId?.trim();
  if (!targetUserId) {
    return new Response(JSON.stringify({ error: "userId_required" }), { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: bootstrapSetting } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", "bootstrap")
    .maybeSingle();

  if (bootstrapSetting?.value?.admin_bootstrap_enabled === false) {
    return new Response(JSON.stringify({ error: "bootstrap_disabled" }), { status: 403 });
  }

  const { count } = await admin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  if ((count ?? 0) > 0) {
    return new Response(JSON.stringify({ error: "admin_already_exists" }), { status: 409 });
  }

  const { data: profile, error: profileErr } = await admin
    .from("profiles")
    .select("id")
    .eq("id", targetUserId)
    .maybeSingle();

  if (profileErr || !profile) {
    return new Response(JSON.stringify({ error: "user_not_found" }), { status: 404 });
  }

  const allowedEmail = Deno.env.get("MARKETPLACE_BOOTSTRAP_ADMIN_EMAIL")?.toLowerCase();
  if (allowedEmail) {
    const { data: authUser } = await admin.auth.admin.getUserById(targetUserId);
    if (authUser.user?.email?.toLowerCase() !== allowedEmail) {
      return new Response(JSON.stringify({ error: "email_not_allowed" }), { status: 403 });
    }
  }

  const { error: insErr } = await admin.from("user_roles").insert([
    { user_id: targetUserId, role: "admin", granted_by: targetUserId },
    { user_id: targetUserId, role: "moderator", granted_by: targetUserId },
  ]);
  if (insErr) {
    return new Response(JSON.stringify({ error: insErr.message }), { status: 500 });
  }

  await admin
    .from("platform_settings")
    .upsert({
      key: "bootstrap",
      value: { admin_bootstrap_enabled: false },
      updated_at: new Date().toISOString(),
    });

  return new Response(JSON.stringify({ ok: true, userId: targetUserId }), {
    headers: { "Content-Type": "application/json" },
  });
});
