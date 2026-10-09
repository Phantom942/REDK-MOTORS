/** Helpers partagés — tests marketplace locaux uniquement. */
import sharp from "sharp";

export const DEFAULT_PASSWORD = process.env.MARKETPLACE_TEST_USER_A_PASSWORD || "TestMarketplace-Local-2026!";
export const INBUCKET_URL = process.env.MARKETPLACE_INBUCKET_URL || "http://127.0.0.1:54324";

export async function authToken(baseUrl, anonKey, email, password = DEFAULT_PASSWORD) {
  const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "auth_failed");
  return { token: data.access_token, userId: data.user.id, refreshToken: data.refresh_token };
}

export async function rest(baseUrl, anonKey, token, method, table, query = "", body) {
  const res = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
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
  return { ok: res.ok, status: res.status, json, text };
}

export async function rpc(baseUrl, anonKey, token, fn, args) {
  return rest(baseUrl, anonKey, token, "POST", `rpc/${fn}`, "", args);
}

export async function makeTestJpeg() {
  return sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 40, g: 80, b: 120 } },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function uploadPhotoEdge(baseUrl, anonKey, userToken, listingId, buffer, sortOrder) {
  const form = new FormData();
  form.set("listingId", listingId);
  form.set("sortOrder", String(sortOrder));
  form.set("file", new Blob([buffer], { type: "image/jpeg" }), "test.jpg");
  const res = await fetch(`${baseUrl}/functions/v1/process-listing-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}`, apikey: anonKey },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

export async function moderateEdge(baseUrl, anonKey, modToken, payload) {
  const res = await fetch(`${baseUrl}/functions/v1/moderate-listing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${modToken}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

export async function createDraftListing(baseUrl, anonKey, ownerToken, ownerId, overrides = {}) {
  return rest(baseUrl, anonKey, ownerToken, "POST", "listings", "", {
    owner_id: ownerId,
    seller_type: "private",
    status: "draft",
    make: "Renault",
    model: "Clio",
    model_year: 2018,
    mileage_km: 60000,
    fuel: "essence",
    gearbox: "manuelle",
    price_cents: 990000,
    city: "Ivry-sur-Seine",
    postal_code: "94200",
    description: "Annonce test automatisé marketplace local.",
    contact_phone: "0612345678",
    ...overrides,
  });
}

export async function approveListing(baseUrl, anonKey, modToken, listingId, versionNumber) {
  return moderateEdge(baseUrl, anonKey, modToken, {
    listingId,
    versionNumber,
    action: "approve",
  });
}

export async function publishListingWithPhotos(baseUrl, anonKey, ownerToken, ownerId, modToken, count = 3) {
  const draft = await createDraftListing(baseUrl, anonKey, ownerToken, ownerId);
  if (!draft.ok || !draft.json?.[0]?.id) throw new Error("draft_failed");
  const listingId = draft.json[0].id;
  const img = await makeTestJpeg();
  for (let i = 0; i < count; i++) {
    const up = await uploadPhotoEdge(baseUrl, anonKey, ownerToken, listingId, img, i);
    if (!up.ok) throw new Error(up.body?.error || "upload_failed");
  }
  const submit = await rpc(baseUrl, anonKey, ownerToken, "submit_listing_for_review", { p_listing_id: listingId });
  if (!submit.ok) throw new Error("submit_failed");
  const { json: row } = await rest(
    baseUrl,
    anonKey,
    modToken,
    "GET",
    `listings?id=eq.${listingId}&select=pending_version`,
  );
  const pv = row?.[0]?.pending_version;
  const appr = await approveListing(baseUrl, anonKey, modToken, listingId, pv);
  if (!appr.ok) throw new Error(appr.body?.error || "approve_failed");
  const { json: photos } = await rest(
    baseUrl,
    anonKey,
    null,
    "GET",
    `listing_public_photos?listing_id=eq.${listingId}&select=id`,
  );
  return { listingId, photoId: photos?.[0]?.id, pendingVersion: pv };
}

/** Dernière URL de vérification / recovery dans Mailpit (Inbucket port local). */
export async function waitForMailLink(filterSubject, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${INBUCKET_URL}/api/v1/messages`);
    const data = await res.json();
    const msg = (data.messages ?? []).find((m) => !filterSubject || m.Subject?.includes(filterSubject));
    if (msg?.ID) {
      const full = await fetch(`${INBUCKET_URL}/api/v1/message/${msg.ID}`);
      const body = await full.json();
      const hay = `${body.Text ?? ""}\n${body.HTML ?? ""}`;
      const match = hay.match(/https?:\/\/[^\s)"']+(?:verify|confirm)[^\s)"']*/i);
      if (match) return match[0].replace(/&amp;/g, "&");
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("mail_link_timeout");
}

/** Visiteur sans en-têtes custom (comme <img src> navigateur). */
export async function servePhotoVisitor(baseUrl, photoId) {
  return fetch(`${baseUrl}/functions/v1/serve-listing-photo?photoId=${encodeURIComponent(photoId)}`);
}
