import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${jwt}` } } });
  const { data: userRes } = await userClient.auth.getUser();
  const uid = userRes.user?.id;
  if (!uid) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });

  const admin = createClient(url, serviceKey);
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
  if (!roles?.length) {
    return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
  }

  const body = (await req.json()) as { exportType?: string };
  if (body.exportType !== "consents") {
    return new Response(JSON.stringify({ error: "invalid_export" }), { status: 400 });
  }

  const { data: rows, error } = await admin
    .from("consent_records")
    .select("user_id, channel, granted, consent_text_version, recorded_at")
    .order("recorded_at", { ascending: false })
    .limit(5000);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  await admin.from("admin_audit_log").insert({
    actor_id: uid,
    action: "export_csv",
    target_type: "consent_records",
    metadata: { row_count: rows?.length ?? 0 },
  });

  const header = "user_id,channel,granted,consent_text_version,recorded_at\n";
  const csv =
    header +
    (rows ?? [])
      .map((r) =>
        [r.user_id, r.channel, r.granted, r.consent_text_version, r.recorded_at]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="consentements.csv"',
    },
  });
});
