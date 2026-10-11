#!/usr/bin/env node
/**
 * Comptes recette préprod (cloud) — pas de reset DB.
 * Emails @recette.redkmotors.fr, mot de passe via MARKETPLACE_PREPROD_TEST_PASSWORD.
 */
import { requirePreprodEnv } from "./lib/marketplace-preprod-guard.mjs";

const USERS = [
  { email: "mp-vendeur-a@recette.redkmotors.fr", role: "user" },
  { email: "mp-vendeur-b@recette.redkmotors.fr", role: "user" },
  { email: "mp-moderateur@recette.redkmotors.fr", role: "moderator" },
  { email: "mp-admin@recette.redkmotors.fr", role: "admin_pending_bootstrap" },
  { email: "mp-staff@recette.redkmotors.fr", role: "garage_staff" },
];

async function findUserIdByEmail(baseUrl, serviceKey, email) {
  const res = await fetch(
    `${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const users = data.users ?? data;
  const hit = Array.isArray(users) ? users.find((u) => u.email === email) : null;
  return hit?.id ?? null;
}

async function adminCreateUser(baseUrl, serviceKey, email, password) {
  const existing = await findUserIdByEmail(baseUrl, serviceKey, email);
  if (existing) {
    console.log(`  réutilise ${email}`);
    return existing;
  }
  const res = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: "Recette",
        last_name: email.split("@")[0],
        phone: "0600000000",
        city: "Ivry-sur-Seine",
        postal_code: "94200",
        marketing_consents: {
          email_marketing: false,
          sms_marketing: false,
          whatsapp_marketing: false,
        },
        consent_text_version: "2026-04-08-v1",
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || JSON.stringify(data));
  console.log(`  créé ${email}`);
  return data.id;
}

async function assignRole(baseUrl, serviceKey, userId, role) {
  const check = await fetch(
    `${baseUrl}/rest/v1/user_roles?user_id=eq.${userId}&role=eq.${role}&select=role&limit=1`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    },
  );
  const rows = await check.json();
  if (Array.isArray(rows) && rows.length) return;

  const res = await fetch(`${baseUrl}/rest/v1/user_roles`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ user_id: userId, role, granted_by: userId }),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function main() {
  process.env.MARKETPLACE_PREPROD_ALLOW_RUN = "preprod-redkmotors-smoke";
  const { baseUrl } = requirePreprodEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const password = process.env.MARKETPLACE_PREPROD_TEST_PASSWORD?.trim();
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant (.env.preprod.local)");
  if (!password) throw new Error("MARKETPLACE_PREPROD_TEST_PASSWORD manquant");

  const ids = {};
  for (const u of USERS) {
    ids[u.email] = await adminCreateUser(baseUrl, serviceKey, u.email, password);
  }

  for (const u of USERS) {
    if (u.role === "user" || u.role === "admin_pending_bootstrap") continue;
    await assignRole(baseUrl, serviceKey, ids[u.email], u.role);
  }

  console.log(JSON.stringify({ adminUserId: ids["mp-admin@recette.redkmotors.fr"] }));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
