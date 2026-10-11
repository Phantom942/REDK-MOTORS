#!/usr/bin/env node
/**
 * GitHub Actions secrets via API (sans gh CLI).
 * Token : env GH_TOKEN / GITHUB_TOKEN ou fichier .github-setup.local (gitignore).
 * Scopes : repo + workflow (classic PAT) ou équivalent fine-grained.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDotenvFile } from "./lib/load-dotenv-file.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const owner = "Phantom942";
const repo = "REDK-MOTORS";

function getToken() {
  const fromFile = path.join(repoRoot, ".github-setup.local");
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN && fs.existsSync(fromFile)) {
    process.env.GH_TOKEN = fs.readFileSync(fromFile, "utf8").trim();
  }
  const t = process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (!t) {
    throw new Error(
      "Token GitHub manquant. Copiez un PAT (ghp_… ou github_pat_…) puis: npm run store:github-token",
    );
  }
  return t;
}

async function gh(pathname, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`https://api.github.com${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`GitHub ${pathname} → ${res.status}: ${typeof json === "object" ? JSON.stringify(json) : text}`);
  }
  return json;
}

function sealSecret(publicKey, secretValue) {
  const key = Buffer.from(publicKey, "base64");
  const message = Buffer.from(secretValue, "utf8");
  const sealed = crypto.publicEncrypt(
    { key, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    message,
  );
  return sealed.toString("base64");
}

async function setSecret(name, value) {
  if (!value) {
    console.log(`Skip ${name} (vide)`);
    return;
  }
  const { key_id, key } = await gh(`/repos/${owner}/${repo}/actions/secrets/public-key`);
  await gh(`/repos/${owner}/${repo}/actions/secrets/${name}`, {
    method: "PUT",
    body: { encrypted_value: sealSecret(key, value), key_id },
  });
  console.log(`OK secret ${name}`);
}

async function ensurePullRequest() {
  try {
    const existing = await gh(`/repos/${owner}/${repo}/pulls?head=${owner}:feat/marketplace-occasions&state=open`);
    if (Array.isArray(existing) && existing.length) {
      console.log(`PR existante: ${existing[0].html_url}`);
      return existing[0].html_url;
    }
    const pr = await gh(`/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      body: {
        title: "feat(marketplace): occasions, préprod Supabase et CI",
        head: "feat/marketplace-occasions",
        base: "main",
        body: "## Summary\n- Marketplace occasions (Eleventy + Supabase)\n- Scripts préprod, CI validation, build préprod\n- Supabase cloud préprod provisionné (opérateur)\n\n## Test plan\n- [ ] CI marketplace-validation\n- [ ] Workflow manuel marketplace-preprod-build (PREPROD-OK)\n- [ ] Smoke préprod: `npm run test:marketplace:preprod`",
      },
    });
    console.log(`PR créée: ${pr.html_url}`);
    return pr.html_url;
  } catch (e) {
    console.warn("PR:", e.message);
    return null;
  }
}

async function main() {
  const env = loadDotenvFile(path.join(repoRoot, ".env.preprod.local"));
  await gh(`/repos/${owner}/${repo}`);
  console.log(`Repo ${owner}/${repo} — token OK\n`);

  await setSecret("MARKETPLACE_PREPROD_SUPABASE_URL", env.MARKETPLACE_PREPROD_SUPABASE_URL);
  await setSecret("MARKETPLACE_PREPROD_ANON_KEY", env.MARKETPLACE_PREPROD_ANON_KEY);
  await setSecret("MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF", env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF);
  await setSecret("MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL", env.MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL);
  await setSecret("MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL", env.MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL);
  await setSecret("MARKETPLACE_PREPROD_TEST_PASSWORD", env.MARKETPLACE_PREPROD_TEST_PASSWORD);

  await ensurePullRequest();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
