#!/usr/bin/env node
/**
 * Crée comptes de test + rôles (service role). Localhost only.
 */
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";

const PASSWORD = "TestMarketplace-Local-2026!";
const USERS = [
  { key: "A", email: "mp-vendeur-a@test.local", role: "user" },
  { key: "B", email: "mp-vendeur-b@test.local", role: "user" },
  { key: "MOD", email: "mp-moderateur@test.local", role: "moderator" },
  { key: "ADMIN", email: "mp-admin@test.local", role: "admin" },
  { key: "STAFF", email: "mp-staff@test.local", role: "garage_staff" },
  { key: "SUSP", email: "mp-suspendu@test.local", role: "user", suspended: true },
];

async function adminCreateUser(baseUrl, serviceKey, { email, suspended }) {
  const res = await fetch(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: "Test",
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
  const userId = data.id;

  return userId;
}

async function assignRole(baseUrl, serviceKey, userId, role) {
  if (role === "user") return;
  await fetch(`${baseUrl}/rest/v1/user_roles`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ user_id: userId, role, granted_by: userId }),
  });
}

async function main() {
  const { baseUrl, anonKey, serviceKey } = requireLocalEnv();
  const ids = {};

  for (const u of USERS) {
    try {
      const id = await adminCreateUser(baseUrl, serviceKey, u);
      ids[u.key] = id;
      await assignRole(baseUrl, serviceKey, id, u.role);
      if (u.role === "admin") {
        await assignRole(baseUrl, serviceKey, id, "moderator");
      }
      console.log(`  seed ${u.key} ${u.email} → ${id}`);
    } catch (e) {
      console.error(`  seed ${u.key} échec :`, e.message);
      process.exit(1);
    }
  }

  const susp = USERS.find((u) => u.suspended);
  if (susp && ids.ADMIN && ids.SUSP) {
    const adminLogin = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: USERS.find((x) => x.key === "ADMIN").email, password: PASSWORD }),
    });
    const adminTok = (await adminLogin.json()).access_token;
    await fetch(`${baseUrl}/rest/v1/rpc/suspend_account`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${adminTok}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_user_id: ids.SUSP, p_reason: "seed_test" }),
    });
    console.log("  seed SUSP suspendu via RPC admin");
  }

  const out = {
    baseUrl,
    password: PASSWORD,
    users: Object.fromEntries(USERS.map((u) => [u.key, { email: u.email, id: ids[u.key] }])),
  };

  console.log("\n--- Copier pour les tests (local uniquement) ---");
  console.log(`MARKETPLACE_TEST_URL=${baseUrl}`);
  console.log(`MARKETPLACE_TEST_ANON_KEY=(voir: npx supabase status -o env)`);
  console.log(`MARKETPLACE_TEST_SERVICE_ROLE_KEY=(service role — ne pas committer)`);
  console.log(`MARKETPLACE_TEST_USER_A_EMAIL=${USERS[0].email}`);
  console.log(`MARKETPLACE_TEST_USER_A_PASSWORD=${PASSWORD}`);
  console.log(`MARKETPLACE_TEST_USER_B_EMAIL=${USERS[1].email}`);
  console.log(`MARKETPLACE_TEST_USER_B_PASSWORD=${PASSWORD}`);
  console.log(`MARKETPLACE_TEST_MOD_EMAIL=${USERS[2].email}`);
  console.log(`MARKETPLACE_TEST_MOD_PASSWORD=${PASSWORD}`);
  console.log(`MARKETPLACE_TEST_ADMIN_EMAIL=${USERS[3].email}`);
  console.log(`MARKETPLACE_TEST_ADMIN_PASSWORD=${PASSWORD}`);
  console.log(`MARKETPLACE_TEST_STAFF_EMAIL=${USERS.find((u) => u.key === "STAFF")?.email}`);
  console.log(`MARKETPLACE_TEST_STAFF_PASSWORD=${PASSWORD}`);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
