import { getSupabase, isConfigured } from "./client.js";
import { readMarketplaceConfig } from "./config.js";
import { signedPhotoUrl } from "./photos.js";
import { getValidSession, redirectToLogin } from "./session.js";

function alert(type, msg) {
  return `<div class="mp-alert mp-alert--${type}" role="${type === "error" ? "alert" : "status"}">${msg}</div>`;
}

async function hasModeratorRole(supabase, uid) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
  return (data ?? []).some((r) => r.role === "moderator" || r.role === "admin");
}

async function hasAdminRole(supabase, uid) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
  return (data ?? []).length > 0;
}

export async function mountAdminApp(root) {
  if (!isConfigured()) {
    root.hidden = false;
    root.innerHTML = alert("info", "Administration marketplace non activée.");
    return;
  }

  const supabase = getSupabase();
  const { session, reason } = await getValidSession(supabase);
  if (!session) {
    redirectToLogin(reason);
    return;
  }

  const uid = session.user.id;
  const isMod = await hasModeratorRole(supabase, uid);
  if (!isMod) {
    root.hidden = false;
    root.innerHTML = alert("error", "Accès réservé aux modérateurs.");
    return;
  }

  const isAdmin = await hasAdminRole(supabase, uid);
  root.hidden = false;

  const { data: pending } = await supabase
    .from("listings")
    .select("id, make, model, model_year, pending_version, owner_id, description, price_cents, updated_at")
    .eq("status", "pending_review")
    .order("updated_at", { ascending: true });

  const { count: pendingCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  root.innerHTML = `
    <div class="container mp-admin">
      <h2>Modération annonces</h2>
      <p>${pendingCount ?? 0} annonce(s) en attente · ${isAdmin ? "Administrateur" : "Modérateur"}</p>
      <div id="mp-admin-queue"></div>
    </div>`;

  const queue = root.querySelector("#mp-admin-queue");
  if (!pending?.length) {
    queue.innerHTML = alert("info", "Aucune annonce en attente.");
    return;
  }

  for (const row of pending) {
    const { data: photos } = await supabase
      .from("listing_photos")
      .select("storage_path")
      .eq("listing_id", row.id)
      .eq("version_number", row.pending_version)
      .order("sort_order");

    const thumbs = await Promise.all(
      (photos ?? []).map(async (p) => {
        try {
          return await signedPhotoUrl(p.storage_path);
        } catch {
          return null;
        }
      }),
    );

    const card = document.createElement("article");
    card.className = "mp-admin-card";
    card.innerHTML = `
      <h3>${row.make} ${row.model} ${row.model_year}</h3>
      <p>${(row.price_cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} · v${row.pending_version}</p>
      <div class="mp-photos">${thumbs.filter(Boolean).map((u) => `<img src="${u}" alt="" class="mp-admin-thumb" />`).join("")}</div>
      <details><summary>Description</summary><p>${row.description.slice(0, 500)}</p></details>
      <form class="mp-admin-action">
        <input type="hidden" name="listingId" value="${row.id}" />
        <input type="hidden" name="version" value="${row.pending_version}" />
        <label>Motif public (refus)<input name="publicReason" /></label>
        <label>Note interne<input name="internalNote" /></label>
        <button type="submit" name="action" value="approve" class="btn btn--primary">Valider</button>
        <button type="submit" name="action" value="reject" class="btn btn--secondary btn--dark">Refuser</button>
      </form>
      <div class="mp-admin-feedback"></div>`;

    card.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const action = fd.get("action");
      const fb = card.querySelector(".mp-admin-feedback");
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) {
        fb.innerHTML = alert("error", "Session expirée.");
        return;
      }

      const cfg = readMarketplaceConfig();
      const res = await fetch(`${cfg.supabaseUrl}/functions/v1/moderate-listing`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          apikey: cfg.supabaseAnonKey,
        },
        body: JSON.stringify({
          listingId: fd.get("listingId"),
          versionNumber: Number(fd.get("version")),
          action: action === "approve" ? "approve" : "reject",
          publicReason: fd.get("publicReason") || undefined,
          internalNote: fd.get("internalNote") || undefined,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        fb.innerHTML = alert("error", body.error === "stale_version" ? "Version obsolète — rechargez la page." : "Action refusée.");
        return;
      }
      fb.innerHTML = alert("success", action === "approve" ? `Publiée (${body.slug ?? ""})` : "Refus enregistré.");
      card.remove();
    });

    queue.appendChild(card);
  }
}
