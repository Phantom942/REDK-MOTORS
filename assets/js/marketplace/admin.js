import { getSupabase, isConfigured } from "./client.js";
import { readMarketplaceConfig } from "./config.js";
import { signedPhotoUrl } from "./photos.js";
import { getValidSession, redirectToLogin } from "./session.js";

function alert(type, msg) {
  return `<div class="mp-alert mp-alert--${type}" role="${type === "error" ? "alert" : "status"}">${msg}</div>`;
}

async function rolesOf(supabase, uid) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
  return (data ?? []).map((r) => r.role);
}

async function moderateListing(cfg, token, payload) {
  const res = await fetch(`${cfg.supabaseUrl}/functions/v1/moderate-listing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      apikey: cfg.supabaseAnonKey,
    },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, body: await res.json().catch(() => ({})) };
}

export async function mountAdminApp(root) {
  if (!isConfigured()) {
    root.hidden = false;
    root.innerHTML = alert("info", "Administration marketplace non activée.");
    return;
  }

  const supabase = getSupabase();
  const cfg = readMarketplaceConfig();
  const { session, reason } = await getValidSession(supabase);
  if (!session) {
    redirectToLogin(reason);
    return;
  }

  const uid = session.user.id;
  const roles = await rolesOf(supabase, uid);
  const isMod = roles.includes("moderator") || roles.includes("admin");
  const isAdmin = roles.includes("admin");
  if (!isMod) {
    root.hidden = false;
    root.innerHTML = alert("error", "Accès réservé aux modérateurs.");
    return;
  }

  const view = new URLSearchParams(window.location.search).get("view") || "overview";
  root.hidden = false;

  const [{ count: pendingCount }, { count: publishedCount }, { count: openReports }, { count: dupCount }] =
    await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("listing_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("duplicate_flags").select("*", { count: "exact", head: true }).eq("severity", "blocked"),
    ]);

  root.innerHTML = `
    <div class="container mp-admin">
      <h2>Administration marketplace</h2>
      <p class="mp-form__hint">Affichage selon votre rôle — les actions sensibles passent par les Edge Functions / RPC.</p>
      <nav class="mp-account__nav">
        <a href="?view=overview" class="${view === "overview" ? "is-active" : ""}">Vue d'ensemble</a>
        <a href="?view=queue" class="${view === "queue" ? "is-active" : ""}">En attente (${pendingCount ?? 0})</a>
        <a href="?view=duplicates" class="${view === "duplicates" ? "is-active" : ""}">Doublons</a>
        <a href="?view=reports" class="${view === "reports" ? "is-active" : ""}">Signalements</a>
        <a href="?view=users" class="${view === "users" ? "is-active" : ""}">Utilisateurs</a>
        ${isAdmin ? `<a href="?view=export" class="${view === "export" ? "is-active" : ""}">Export CSV</a>` : ""}
      </nav>
      <div id="mp-admin-panel"></div>
    </div>`;

  const panel = root.querySelector("#mp-admin-panel");

  if (view === "overview") {
    panel.innerHTML = `
      <ul class="mp-admin-stats">
        <li>En attente : <strong>${pendingCount ?? 0}</strong></li>
        <li>Publiées : <strong>${publishedCount ?? 0}</strong></li>
        <li>Signalements ouverts : <strong>${openReports ?? 0}</strong></li>
        <li>Alertes doublons : <strong>${dupCount ?? 0}</strong></li>
      </ul>
      <p>Dépôt-vente : réservé au staff garage (création via procédure staff — pas de formulaire public).</p>`;
    return;
  }

  if (view === "export" && isAdmin) {
    panel.innerHTML = `<button type="button" id="mp-export-consents" class="btn btn--primary">Exporter consentements (CSV)</button><div id="mp-export-fb"></div>`;
    panel.querySelector("#mp-export-consents").addEventListener("click", async () => {
      const fb = panel.querySelector("#mp-export-fb");
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        fb.innerHTML = alert("error", "Session expirée.");
        return;
      }
      const res = await fetch(`${cfg.supabaseUrl}/functions/v1/admin-export`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, apikey: cfg.supabaseAnonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ exportType: "consents" }),
      });
      if (!res.ok) {
        fb.innerHTML = alert("error", "Export refusé.");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "consentements.csv";
      a.click();
      fb.innerHTML = alert("success", "Export téléchargé (action journalisée côté serveur).");
    });
    return;
  }

  if (view === "duplicates") {
    const { data: dups } = await supabase
      .from("duplicate_flags")
      .select("id, listing_id, matched_listing_id, severity, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    panel.innerHTML = `<table class="mp-table"><thead><tr><th>Annonce</th><th>Match</th><th>Sévérité</th></tr></thead><tbody>${(dups ?? [])
      .map((d) => `<tr><td>${d.listing_id}</td><td>${d.matched_listing_id ?? "—"}</td><td>${d.severity}</td></tr>`)
      .join("")}</tbody></table>`;
    return;
  }

  if (view === "reports") {
    const { data: reps } = await supabase
      .from("listing_reports")
      .select("id, listing_id, reason, created_at, resolved_at")
      .order("created_at", { ascending: false })
      .limit(30);
    panel.innerHTML = `<table class="mp-table"><thead><tr><th>Annonce</th><th>Motif</th><th>Statut</th></tr></thead><tbody>${(reps ?? [])
      .map(
        (r) =>
          `<tr><td>${r.listing_id}</td><td>${r.reason ?? ""}</td><td>${r.resolved_at ? "Clos" : "Ouvert"}</td></tr>`,
      )
      .join("")}</tbody></table>`;
    return;
  }

  if (view === "users") {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, account_status, phone, city")
      .order("updated_at", { ascending: false })
      .limit(40);
    panel.innerHTML = `
      <table class="mp-table"><thead><tr><th>Nom</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>${(profiles ?? [])
        .map((p) => {
          const suspendBtn =
            p.account_status === "active" && isMod
              ? `<button type="button" data-suspend="${p.id}" class="btn btn--secondary btn--dark">Suspendre</button>`
              : "";
          const reactBtn =
            p.account_status === "suspended" && isAdmin
              ? `<button type="button" data-reactivate="${p.id}" class="btn btn--secondary">Réactiver</button>`
              : "";
          return `<tr><td>${p.first_name ?? ""} ${p.last_name ?? ""}</td><td>${p.account_status}</td><td>${suspendBtn}${reactBtn}</td></tr>`;
        })
        .join("")}</tbody></table>
      <div id="mp-user-fb"></div>`;
    panel.querySelectorAll("[data-suspend]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const { error } = await supabase.rpc("suspend_account", { p_user_id: btn.dataset.suspend, p_reason: "admin_panel" });
        panel.querySelector("#mp-user-fb").innerHTML = error ? alert("error", "Échec suspension.") : alert("success", "Compte suspendu (annonces retirées, pas de republication auto).");
      });
    });
    panel.querySelectorAll("[data-reactivate]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const { error } = await supabase.rpc("reactivate_account", { p_user_id: btn.dataset.reactivate });
        panel.querySelector("#mp-user-fb").innerHTML = error ? alert("error", "Échec.") : alert("success", "Compte réactivé.");
      });
    });
    return;
  }

  // queue
  const { data: pending } = await supabase
    .from("listings")
    .select("id, make, model, model_year, pending_version, owner_id, description, price_cents, moderation_notes_internal")
    .eq("status", "pending_review")
    .order("updated_at", { ascending: true });

  if (!pending?.length) {
    panel.innerHTML = alert("info", "Aucune annonce en attente.");
    return;
  }

  panel.innerHTML = `<div id="mp-admin-queue"></div>`;
  const queue = panel.querySelector("#mp-admin-queue");

  for (const row of pending) {
    const { data: photos } = await supabase
      .from("listing_photos")
      .select("storage_path, server_verified")
      .eq("listing_id", row.id)
      .eq("version_number", row.pending_version)
      .order("sort_order");

    const thumbs = await Promise.all(
      (photos ?? []).map(async (p) => (p.server_verified ? signedPhotoUrl(p.storage_path) : null)),
    );

    const { data: events } = await supabase
      .from("moderation_events")
      .select("action, created_at, public_reason, internal_note")
      .eq("listing_id", row.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const card = document.createElement("article");
    card.className = "mp-admin-card";
    card.innerHTML = `
      <h3>${row.make} ${row.model} ${row.model_year}</h3>
      <p>${(row.price_cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} · v${row.pending_version}</p>
      <div class="mp-photos">${thumbs.filter(Boolean).map((u) => `<img src="${u}" alt="" class="mp-admin-thumb" />`).join("")}</div>
      <details><summary>Description</summary><p>${row.description.slice(0, 800)}</p></details>
      <details><summary>Historique</summary><ul>${(events ?? [])
        .map((ev) => `<li>${ev.action} — ${new Date(ev.created_at).toLocaleString("fr-FR")}</li>`)
        .join("")}</ul></details>
      <p class="mp-form__hint">Note interne : ${row.moderation_notes_internal ?? "—"}</p>
      <form class="mp-admin-action">
        <input type="hidden" name="listingId" value="${row.id}" />
        <input type="hidden" name="version" value="${row.pending_version}" />
        <label>Motif public (refus)<input name="publicReason" required /></label>
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
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        fb.innerHTML = alert("error", "Session expirée.");
        return;
      }
      const { ok, body } = await moderateListing(cfg, token, {
        listingId: fd.get("listingId"),
        versionNumber: Number(fd.get("version")),
        action: action === "approve" ? "approve" : "reject",
        publicReason: fd.get("publicReason") || undefined,
        internalNote: fd.get("internalNote") || undefined,
      });
      if (!ok) {
        const msg =
          body.error === "stale_version"
            ? "Version obsolète — rechargez."
            : body.error === "photos_not_ready"
              ? "Photos non prêtes (traitement serveur / fichiers manquants)."
              : "Action refusée.";
        fb.innerHTML = alert("error", msg);
        return;
      }
      fb.innerHTML = alert("success", action === "approve" ? `Publiée (${body.slug ?? ""})` : "Refus enregistré.");
      card.remove();
    });
    queue.appendChild(card);
  }
}
