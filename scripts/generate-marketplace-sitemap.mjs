#!/usr/bin/env node
/**
 * Génère sitemap-marketplace.xml (annonces publiées).
 * Non référencé dans robots tant que MARKETPLACE_PUBLIC_INDEX !== 1.
 *
 * Env : MARKETPLACE_TEST_URL + MARKETPLACE_TEST_ANON_KEY (local ou prod preview)
 */
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./lib/marketplace-local-env.mjs";

const siteUrl = (process.env.MARKETPLACE_SITE_URL || "https://redkmotors.fr").replace(/\/$/, "");
const supabaseUrl = process.env.MARKETPLACE_TEST_URL || process.env.MARKETPLACE_SUPABASE_URL;
const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY || process.env.MARKETPLACE_SUPABASE_ANON_KEY;
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repoRoot, "_site");

async function main() {
  if (!supabaseUrl || !anonKey) {
    console.error("Variables Supabase manquantes — sitemap marketplace ignoré");
    process.exit(0);
  }

  const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/list_published_listing_sitemap_rows`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!res.ok) {
    console.error("RPC sitemap échec", res.status);
    process.exit(1);
  }

  const rows = await res.json();
  const urls = (rows ?? [])
    .filter((r) => r.slug)
    .map((r) => {
      const loc = `${siteUrl}/achat-revente/vehicules/${encodeURIComponent(r.slug)}/`;
      const lastmod = r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : "";
      return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>daily</changefreq><priority>0.7</priority></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, "sitemap-marketplace.xml");
  fs.writeFileSync(target, xml);
  console.log(`Écrit ${target} (${rows?.length ?? 0} URLs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
