#!/usr/bin/env node
/**
 * Concurrence réelle : double décision modération, approbation vs rejet simultanés.
 */
import {
  approveListing,
  authToken,
  createDraftListing,
  moderateEdge,
  rpc,
  uploadPhotoEdge,
  makeTestJpeg,
  rest,
} from "./lib/marketplace-test-api.mjs";

const baseUrl = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
const modEmail = process.env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local";
const password = process.env.MARKETPLACE_TEST_USER_A_PASSWORD || "TestMarketplace-Local-2026!";
const sellerEmail = process.env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local";

if (!baseUrl?.includes("127.0.0.1") && !baseUrl?.includes("localhost")) {
  console.error("Refus : tests concurrence réservés à Supabase local");
  process.exit(1);
}

function assertOneOk(results, label) {
  const ok = results.filter((r) => r.ok);
  const fail = results.filter((r) => !r.ok);
  if (ok.length !== 1) {
    console.error(`FAIL ${label} — attendu 1 succès, obtenu ${ok.length}`, results);
    process.exit(1);
  }
  if (fail.length !== 1) {
    console.error(`FAIL ${label} — attendu 1 échec conflictuel`, results);
    process.exit(1);
  }
  const failStatus = fail[0].status;
  if (![409, 500].includes(failStatus) && fail[0].body?.error !== "stale_version") {
    console.log(`  note ${label} : échec secondaire status=${failStatus} error=${fail[0].body?.error}`);
  }
  console.log(`  OK  ${label}`);
}

async function preparePendingListing(modToken, sellerToken, sellerId) {
  const draft = await createDraftListing(baseUrl, anonKey, sellerToken, sellerId, {
    make: "Peugeot",
    model: "208",
    model_year: 2019,
  });
  const listingId = draft.json?.[0]?.id ?? draft.json?.id;
  if (!listingId) throw new Error("draft_failed");

  const buf = await makeTestJpeg();
  for (let i = 0; i < 3; i++) {
    const up = await uploadPhotoEdge(baseUrl, anonKey, sellerToken, listingId, buf, i);
    if (!up.ok) throw new Error("photo_upload_" + up.status);
  }

  const sub = await rpc(baseUrl, anonKey, sellerToken, "submit_listing_for_review", { p_listing_id: listingId });
  if (!sub.ok) throw new Error("submit_" + sub.text);

  const row = await rest(baseUrl, anonKey, modToken, "GET", "listings", `?id=eq.${listingId}&select=status,pending_version`);
  const pendingVersion = row.json?.[0]?.pending_version;
  if (row.json?.[0]?.status !== "pending_review" || !pendingVersion) {
    throw new Error("not_pending");
  }
  return { listingId, pendingVersion };
}

async function main() {
  console.log("=== E2E concurrence marketplace ===\n");

  const { token: modToken } = await authToken(baseUrl, anonKey, modEmail, password);
  const { token: sellerToken, userId: sellerId } = await authToken(baseUrl, anonKey, sellerEmail, password);

  const { listingId, pendingVersion } = await preparePendingListing(modToken, sellerToken, sellerId);

  const payload = {
    listingId,
    versionNumber: pendingVersion,
    action: "approve",
  };
  const rejectPayload = {
    listingId,
    versionNumber: pendingVersion,
    action: "reject",
    publicReason: "Test concurrence rejet",
  };

  const [a, b] = await Promise.all([
    moderateEdge(baseUrl, anonKey, modToken, payload).then((r) => ({ ...r, side: "approve" })),
    moderateEdge(baseUrl, anonKey, modToken, rejectPayload).then((r) => ({ ...r, side: "reject" })),
  ]);

  assertOneOk(
    [
      { ok: a.ok, status: a.status, body: a.body },
      { ok: b.ok, status: b.status, body: b.body },
    ],
    "double décision approve/reject",
  );

  const after = await rest(baseUrl, anonKey, modToken, "GET", "listings", `?id=eq.${listingId}&select=status,slug`);
  const status = after.json?.[0]?.status;
  if (status !== "published" && status !== "rejected") {
    console.error("FAIL état final incohérent", after.json);
    process.exit(1);
  }
  console.log(`  OK  état final unique : ${status}`);

  const events = await rest(
    baseUrl,
    anonKey,
    modToken,
    "GET",
    "moderation_events",
    `?listing_id=eq.${listingId}&action=in.(approved,rejected)&select=action&order=created_at.desc`,
  );
  const approved = (events.json ?? []).filter((e) => e.action === "approved").length;
  const rejected = (events.json ?? []).filter((e) => e.action === "rejected").length;
  if (approved + rejected !== 1) {
    console.error("FAIL double événement modération", events.json);
    process.exit(1);
  }
  console.log("  OK  un seul événement approved/rejected");

  // Approbation pendant begin_edit (version périmée)
  const pub = await preparePendingListing(modToken, sellerToken, sellerId);
  const okFirst = await approveListing(baseUrl, anonKey, modToken, pub.listingId, pub.pendingVersion);
  if (!okFirst.ok) throw new Error("approve_baseline");

  const begin = await rpc(baseUrl, anonKey, sellerToken, "begin_edit_published_listing", {
    p_listing_id: pub.listingId,
  });
  if (!begin.ok) throw new Error("begin_edit_" + begin.text);

  const staleApprove = await moderateEdge(baseUrl, anonKey, modToken, {
    listingId: pub.listingId,
    versionNumber: pub.pendingVersion,
    action: "approve",
  });
  if (staleApprove.ok) {
    console.error("FAIL approbation version périmée acceptée");
    process.exit(1);
  }
  console.log("  OK  approbation version périmée refusée");

  const pubCheck = await rest(baseUrl, anonKey, null, "GET", "listings_public", `?id=eq.${pub.listingId}&select=id`);
  if (pubCheck.json?.length) {
    console.error("FAIL annonce encore publique après begin_edit");
    process.exit(1);
  }
  console.log("  OK  retrait catalogue immédiat après begin_edit");

  console.log("\n=== Concurrence OK ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
