#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyEnv, loadDotenvFile } from "./lib/load-dotenv-file.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
applyEnv(loadDotenvFile(path.join(repoRoot, ".env.preprod.local")));

const baseUrl = process.env.MARKETPLACE_PREPROD_SUPABASE_URL?.replace(/\/$/, "");
const anon = process.env.MARKETPLACE_PREPROD_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const secret = process.env.MARKETPLACE_ADMIN_BOOTSTRAP_SECRET;
const adminUserId = process.argv[2] || "cde41148-ae1d-4c57-b1ab-6e4295fc72ae";

async function tryCall(label, authKey) {
  const res = await fetch(`${baseUrl}/functions/v1/bootstrap-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bootstrap-Secret": secret,
      apikey: authKey,
      Authorization: `Bearer ${authKey}`,
    },
    body: JSON.stringify({ userId: adminUserId }),
  });
  const body = await res.text();
  console.log(label, res.status, body);
  return res.ok;
}

async function assignAdminViaRest() {
  for (const role of ["admin", "moderator"]) {
    const res = await fetch(`${baseUrl}/rest/v1/user_roles`, {
      method: "POST",
      headers: {
        apikey: service,
        Authorization: `Bearer ${service}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ user_id: adminUserId, role, granted_by: adminUserId }),
    });
    if (!res.ok && res.status !== 409) {
      throw new Error(`role ${role}: ${await res.text()}`);
    }
  }
  console.log("admin via REST OK");
}

async function main() {
  if (await tryCall("anon", anon)) return;
  if (await tryCall("service", service)) return;
  await assignAdminViaRest();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
