#!/usr/bin/env node
/**
 * Vérifie fiches SSR (middleware dev) : statuts HTTP, noindex, retrait cache court.
 * Env : MARKETPLACE_TEST_* + MARKETPLACE_SSR_BASE=http://localhost:8081
 */
import { fetchPublicListingBySlug } from "./lib/marketplace-listing-page.mjs";
import {
  approveListing,
  authToken,
  createDraftListing,
  makeTestJpeg,
  publishListingWithPhotos,
  rest,
  rpc,
  uploadPhotoEdge,
} from "./lib/marketplace-test-api.mjs";

const baseUrl = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
const ssrBase = (process.env.MARKETPLACE_SSR_BASE || "http://localhost:8081").replace(/\/$/, "");

if (!baseUrl?.includes("127.0.0.1") && !baseUrl?.includes("localhost")) {
  console.error("Refus : tests SSR réservés à Supabase local");
  process.exit(1);
}

async function fetchFiche(slug) {
  return fetch(`${ssrBase}/achat-revente/vehicules/${encodeURIComponent(slug)}/`, {
    headers: { Accept: "text/html" },
  });
}

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    process.exit(1);
  }
  console.log("  OK ", msg);
}

async function main() {
  console.log("=== SSR fiches marketplace ===\n");
  console.log(`SSR base : ${ssrBase}`);

  const mod = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local");
  const seller = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local");

  const pub = await publishListingWithPhotos(baseUrl, anonKey, seller.token, seller.userId, mod.token);
  const slugRow = await rest(baseUrl, anonKey, mod.token, "GET", "listings", `?id=eq.${pub.listingId}&select=slug,status`);
  const slug = slugRow.json?.[0]?.slug;
  assert(slug, "annonce publiée avec slug");

  const rpcPayload = await fetchPublicListingBySlug(baseUrl, anonKey, slug);
  assert(rpcPayload?.listing?.description, "RPC description complète");

  const htmlRes = await fetchFiche(slug);
  const html = await htmlRes.text();
  assert(htmlRes.status === 200, "fiche 200 publiée");
  assert(/noindex/i.test(html), "robots noindex présent");
  assert(html.includes("Renault") || html.includes("Clio"), "contenu véhicule dans HTML");
  assert(html.includes("0612345678") || html.includes("Appeler"), "contact présent si publié");
  const cc = htmlRes.headers.get("cache-control") || "";
  assert(/max-age=\d+/.test(cc), `Cache-Control présent (${cc})`);

  await rpc(baseUrl, anonKey, seller.token, "withdraw_listing", { p_listing_id: pub.listingId });
  const afterWithdraw = await fetchFiche(slug);
  assert(afterWithdraw.status === 404, "fiche 404 après retrait");
  const wBody = await afterWithdraw.text();
  assert(!wBody.includes("0612345678"), "pas de téléphone après retrait");

  const pub2 = await publishListingWithPhotos(baseUrl, anonKey, seller.token, seller.userId, mod.token);
  const slug2 = (await rest(baseUrl, anonKey, mod.token, "GET", "listings", `?id=eq.${pub2.listingId}&select=slug`)).json?.[0]?.slug;
  await rpc(baseUrl, anonKey, seller.token, "mark_listing_sold", { p_listing_id: pub2.listingId });
  assert((await fetchFiche(slug2)).status === 404, "fiche 404 après vendue (slug retiré)");

  const draft = await createDraftListing(baseUrl, anonKey, seller.token, seller.userId);
  const lid = draft.json?.[0]?.id;
  assert((await fetchPublicListingBySlug(baseUrl, anonKey, "fake-slug-nonexistent")) === null, "RPC null si absent");

  console.log("\n=== SSR OK (retrait texte/coords + statuts HTTP) ===");
  console.log("Note : cache navigateur peut garder HTML ≤60s ; retrait RPC immédiat.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
