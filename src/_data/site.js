/**
 * Données site — en local, MARKETPLACE_TEST_URL + MARKETPLACE_TEST_ANON_KEY
 * activent la marketplace dans Eleventy sans toucher au flag prod (build CI sans env).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "site.json"), "utf8"));

export default function marketplaceLocalOverlay() {
  const site = structuredClone(base);
  const url = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
  const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
  if (url && anonKey && /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url)) {
    site.marketplace = {
      ...site.marketplace,
      enabled: true,
      supabaseUrl: url,
      supabaseAnonKey: anonKey,
    };
  }
  return site;
}
