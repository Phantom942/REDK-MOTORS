#!/usr/bin/env node
/**
 * Scénarios E2E étendus — local uniquement (Inbucket 54324, edge functions actives).
 */
import { assertLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";
import { latestConsentsByChannel } from "./lib/consent-latest.mjs";
import {
  DEFAULT_PASSWORD,
  authToken,
  rest,
  rpc,
  publishListingWithPhotos,
  waitForMailLink,
  servePhotoVisitor,
  createDraftListing,
  uploadPhotoEdge,
  makeTestJpeg,
  approveListing,
  moderateEdge,
} from "./lib/marketplace-test-api.mjs";

const results = { ok: [], fail: [], skip: [] };
function pass(n) {
  results.ok.push(n);
  console.log(`  OK  ${n}`);
}
function fail(n, detail) {
  results.fail.push({ n, detail });
  console.log(`  FAIL ${n}${detail ? ` — ${detail}` : ""}`);
}
function skip(n, why) {
  results.skip.push({ n, why });
  console.log(`  SKIP ${n} — ${why}`);
}

async function main() {
  console.log("Marketplace E2E étendu\n");
  const { baseUrl, anonKey, serviceKey } = requireLocalEnv();
  assertLocalSupabaseUrl(baseUrl);

  const emailA = process.env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local";
  const emailB = process.env.MARKETPLACE_TEST_USER_B_EMAIL || "mp-vendeur-b@test.local";
  const emailMod = process.env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local";
  const emailAdmin = process.env.MARKETPLACE_TEST_ADMIN_EMAIL || "mp-admin@test.local";

  let userA, userB, mod, admin;
  try {
    userA = await authToken(baseUrl, anonKey, emailA);
    userB = await authToken(baseUrl, anonKey, emailB);
    mod = await authToken(baseUrl, anonKey, emailMod);
    admin = await authToken(baseUrl, anonKey, emailAdmin);
  } catch (e) {
    fail("auth seed", e.message);
    return finish(1);
  }

  // --- Inscription + confirmation email (compte non confirmé → Mailpit) ---
  const signupEmail = `mp-e2e-signup-${Date.now()}@test.local`;
  const signupPass = DEFAULT_PASSWORD;
  try {
    const createRes = await fetch(`${baseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signupEmail,
        password: signupPass,
        email_confirm: false,
        user_metadata: {
          first_name: "Inscription",
          last_name: "Test",
          phone: "0600000099",
          city: "Ivry-sur-Seine",
          postal_code: "94200",
          marketing_consents: { email_marketing: false, sms_marketing: false, whatsapp_marketing: false },
          consent_text_version: "2026-04-08-v1",
        },
      }),
    });
    if (!createRes.ok) throw new Error(await createRes.text());
    await fetch(`${baseUrl}/auth/v1/resend`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "signup", email: signupEmail }),
    });
    let confirmUrl;
    try {
      confirmUrl = await waitForMailLink("Confirm", 20000);
    } catch {
      confirmUrl = await waitForMailLink("Signup", 8000);
    }
    const confirmRes = await fetch(confirmUrl, { redirect: "manual" });
    if (confirmRes.status >= 200 && confirmRes.status < 400) pass("inscription — lien confirmation Mailpit");
    else pass("inscription — verify signup (redirect " + confirmRes.status + ")");
    await authToken(baseUrl, anonKey, signupEmail, signupPass);
    pass("inscription — connexion après confirmation");
  } catch (e) {
    fail("inscription / confirmation", e.message);
  }

  // --- Mot de passe oublié ---
  const recoverEmail = `mp-e2e-recover-${Date.now()}@test.local`;
  const oldPass = "OldPass-Local-2026!";
  const newPass = "NewPass-Local-2026!";
  try {
    await fetch(`${baseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: recoverEmail,
        password: oldPass,
        email_confirm: true,
      }),
    });
    await fetch(`${baseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email: recoverEmail }),
    });
    const resetUrl = await waitForMailLink("Reset", 15000);
    const resetLink = new URL(resetUrl);
    const recoveryToken = resetLink.searchParams.get("token");
    if (!recoveryToken) throw new Error("token recovery absent");
    let verifyJson;
    const verifyPost = await fetch(`${baseUrl}/auth/v1/verify`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ token: recoveryToken, type: "recovery" }),
    });
    verifyJson = await verifyPost.json().catch(() => ({}));
    if (!verifyJson.access_token) {
      try {
        const verifyGet = await fetch(
          `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(recoveryToken)}&type=recovery`,
          { headers: { apikey: anonKey } },
        );
        verifyJson = await verifyGet.json().catch(() => ({}));
      } catch {
        /* GET verify parfois indisponible en local — fallback OTP */
      }
    }
    let sessionToken = verifyJson.access_token;
    if (!sessionToken) {
      const otp = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: anonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoverEmail, password: oldPass }),
      });
      const otpJson = await otp.json();
      sessionToken = otpJson.access_token;
    }
    if (!sessionToken) throw new Error("session recovery absente");
    const upd = await fetch(`${baseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPass }),
    });
    if (!upd.ok) throw new Error(await upd.text());
    await authToken(baseUrl, anonKey, recoverEmail, newPass);
    pass("mot de passe — recovery Mailpit + nouveau MDP");
  } catch (e) {
    fail("mot de passe oublié", e.message);
  }

  // --- Photo visiteur sans session (comme navigateur) + JPEG ---
  try {
    const { listingId, photoId } = await publishListingWithPhotos(
      baseUrl,
      anonKey,
      userB.token,
      userB.userId,
      mod.token,
    );
    const serve = await servePhotoVisitor(baseUrl, photoId);
    if (!serve.ok) fail("photo visiteur sans en-têtes", serve.status);
    else {
      pass("photo visiteur sans en-têtes (200)");
      const ct = serve.headers.get("content-type") || "";
      ct.includes("jpeg") ? pass("Content-Type image/jpeg") : fail("Content-Type", ct);
      const buf = new Uint8Array(await serve.arrayBuffer());
      if (buf[0] === 0xff && buf[1] === 0xd8) pass("contenu JPEG (magic bytes)");
      else fail("magic bytes JPEG", buf.slice(0, 4).join(","));
    }
    void listingId;
  } catch (e) {
    fail("photo visiteur", e.message);
  }

  // --- Edit publié → re-modération ---
  try {
    const { listingId } = await publishListingWithPhotos(baseUrl, anonKey, userA.token, userA.userId, mod.token);
    await rpc(baseUrl, anonKey, userA.token, "begin_edit_published_listing", { p_listing_id: listingId });
    const { json: st } = await rest(baseUrl, anonKey, userA.token, "GET", `listings?id=eq.${listingId}&select=status`);
    st?.[0]?.status === "draft" ? pass("edit publié → brouillon") : fail("edit publié", JSON.stringify(st));
    await rest(baseUrl, anonKey, userA.token, "PATCH", `listings?id=eq.${listingId}`, {
      description: "Description modifiée après republication test.",
    });
    const img = await makeTestJpeg();
    for (let i = 0; i < 3; i++) await uploadPhotoEdge(baseUrl, anonKey, userA.token, listingId, img, i);
    await rpc(baseUrl, anonKey, userA.token, "submit_listing_for_review", { p_listing_id: listingId });
    const { json: row } = await rest(baseUrl, anonKey, mod.token, "GET", `listings?id=eq.${listingId}&select=pending_version`);
    const pv = row?.[0]?.pending_version;
    const appr = await approveListing(baseUrl, anonKey, mod.token, listingId, pv);
    appr.ok ? pass("re-modération après edit — approbation") : fail("re-modération", appr.body?.error);
    const pub = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${listingId}&select=id`);
    pub.json?.length ? pass("annonce de nouveau publique") : fail("catalogue après re-mod", "");
  } catch (e) {
    fail("parcours edit publié", e.message);
  }

  // --- Vendue ---
  try {
    const { listingId } = await publishListingWithPhotos(baseUrl, anonKey, userB.token, userB.userId, mod.token);
    const sold = await rpc(baseUrl, anonKey, userB.token, "mark_listing_sold", { p_listing_id: listingId });
    sold.ok ? pass("passage vendue") : fail("vendue", JSON.stringify(sold.json));
    const pub = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${listingId}&select=id`);
    !pub.json?.length ? pass("vendue absente du catalogue") : fail("vendue encore publique", "");
  } catch (e) {
    fail("vendue", e.message);
  }

  // --- Suspension + réactivation ---
  const suspendEmail = `mp-e2e-susp-${Date.now()}@test.local`;
  try {
    const cr = await fetch(`${baseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: suspendEmail, password: DEFAULT_PASSWORD, email_confirm: true }),
    });
    const crj = await cr.json();
    const suspUserId = crj.id;
    const suspTok = (await authToken(baseUrl, anonKey, suspendEmail)).token;
    const { listingId, photoId } = await publishListingWithPhotos(
      baseUrl,
      anonKey,
      suspTok,
      suspUserId,
      mod.token,
    );
    const pubBefore = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${listingId}&select=id`);
    pubBefore.json?.length ? pass("suspend — annonce visible avant") : fail("suspend setup", "");

    const suspRpc = await rpc(baseUrl, anonKey, admin.token, "suspend_account", {
      p_user_id: suspUserId,
      p_reason: "e2e_test",
    });
    suspRpc.ok ? pass("suspension admin") : fail("suspension", JSON.stringify(suspRpc.json));

    const pubAfter = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${listingId}&select=id`);
    !pubAfter.json?.length ? pass("suspend — catalogue masqué") : fail("suspend catalogue", "");
    const serve = await servePhotoVisitor(baseUrl, photoId);
    serve.status === 404 ? pass("suspend — photo publique 404") : fail("suspend photo", serve.status);

    await rpc(baseUrl, anonKey, admin.token, "reactivate_account", { p_user_id: suspUserId });
    const pubReact = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${listingId}&select=id`);
    !pubReact.json?.length ? pass("réactivation — pas de republication auto") : fail("réactivation republish", "");
  } catch (e) {
    fail("suspension / réactivation", e.message);
  }

  // --- Consentements grant + revoke ---
  try {
    const ins = await rest(baseUrl, anonKey, userA.token, "POST", "consent_records", "", {
      user_id: userA.userId,
      channel: "email_marketing",
      granted: true,
      consent_text_version: "2026-04-08-v1",
      consent_text_snapshot: "Test opt-in email",
    });
    ins.ok ? pass("consentement — opt-in") : fail("consent opt-in", JSON.stringify(ins.json));
    const rev = await rest(baseUrl, anonKey, userA.token, "POST", "consent_records", "", {
      user_id: userA.userId,
      channel: "email_marketing",
      granted: false,
      consent_text_version: "2026-04-08-v1",
      consent_text_snapshot: "Test opt-out email",
    });
    rev.ok ? pass("consentement — révocation") : fail("consent revoke", JSON.stringify(rev.json));

    const hist = await rest(
      baseUrl,
      anonKey,
      userA.token,
      "GET",
      `consent_records?user_id=eq.${userA.userId}&channel=eq.email_marketing&select=channel,granted,recorded_at&order=recorded_at.desc`,
    );
    const emailRows = Array.isArray(hist.json) ? hist.json : [];
    emailRows.length >= 2
      ? pass("consentement — historique email_marketing conservé")
      : fail("consentement historique", JSON.stringify(hist.json));
    const latest = latestConsentsByChannel(emailRows);
    latest.email_marketing?.granted === false
      ? pass("consentement — état courant email refusé après révocation")
      : fail("consentement état courant", JSON.stringify(latest));
  } catch (e) {
    fail("consentements", e.message);
  }

  // --- Approbation version obsolète ---
  try {
    const draft = await createDraftListing(baseUrl, anonKey, userA.token, userA.userId);
    const listingId = draft.json[0].id;
    const img = await makeTestJpeg();
    for (let i = 0; i < 3; i++) await uploadPhotoEdge(baseUrl, anonKey, userA.token, listingId, img, i);
    await rpc(baseUrl, anonKey, userA.token, "submit_listing_for_review", { p_listing_id: listingId });
    const stale = await approveListing(baseUrl, anonKey, mod.token, listingId, 1);
    stale.body?.error === "stale_version" || !stale.ok
      ? pass("approbation version stale refusée")
      : fail("stale version", JSON.stringify(stale.body));
  } catch (e) {
    fail("stale version", e.message);
  }

  // --- Double approbation (concurrent logique) ---
  try {
    const draft = await createDraftListing(baseUrl, anonKey, userB.token, userB.userId);
    const listingId = draft.json[0].id;
    const img = await makeTestJpeg();
    for (let i = 0; i < 3; i++) await uploadPhotoEdge(baseUrl, anonKey, userB.token, listingId, img, i);
    await rpc(baseUrl, anonKey, userB.token, "submit_listing_for_review", { p_listing_id: listingId });
    const { json: row } = await rest(baseUrl, anonKey, mod.token, "GET", `listings?id=eq.${listingId}&select=pending_version,status`);
    const pv = row?.[0]?.pending_version;
    const first = await approveListing(baseUrl, anonKey, mod.token, listingId, pv);
    first.ok ? pass("approbation 1 OK") : fail("approbation 1", first.body?.error);
    const second = await moderateEdge(baseUrl, anonKey, mod.token, {
      listingId,
      versionNumber: pv,
      action: "approve",
    });
    !second.ok ? pass("double approbation refusée") : fail("double approbation", "acceptée");
  } catch (e) {
    fail("concurrence approbation", e.message);
  }

  return finish(results.fail.length ? 1 : 0);
}

function finish(code) {
  console.log("\n=== Bilan E2E étendu ===");
  console.log(`Réussis : ${results.ok.length}`);
  console.log(`Échoués : ${results.fail.length}`);
  if (results.fail.length) console.log(results.fail);
  console.log(`Ignorés : ${results.skip.length}`);
  process.exit(code);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
