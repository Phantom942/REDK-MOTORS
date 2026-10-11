#!/usr/bin/env node
/** Upload fixture JPEGs to a draft listing (local dev helper). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";
import { authToken, uploadPhotoEdge } from "./lib/marketplace-test-api.mjs";

const listingId = process.argv[2];
if (!listingId) {
  console.error("Usage: node scripts/marketplace-upload-fixtures.mjs <listing-uuid>");
  process.exit(2);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "mp-browser");

async function main() {
  const { baseUrl, anonKey } = requireLocalEnv();
  const user = await authToken(baseUrl, anonKey, "mp-vendeur-a@test.local", "TestMarketplace-Local-2026!");
  for (let i = 0; i < 3; i++) {
    const buf = fs.readFileSync(path.join(fixtureDir, `photo-${i}.jpg`));
    const up = await uploadPhotoEdge(baseUrl, anonKey, user.token, listingId, buf, i);
    if (!up.ok) {
      console.error("upload failed", i, up);
      process.exit(1);
    }
    console.log(`  OK photo ${i + 1}`);
  }
}

main();
