import { getSupabase, isConfigured } from "./client.js";
import { CONSENT_TEXT, readMarketplaceConfig } from "./config.js";
import { loadConsentState, persistConsentChoices } from "./consents.js";
import { getValidSession, isRecoveryFlow, redirectToLogin, runWithNetwork } from "./session.js";

function alertHtml(type, msg) {
  return `<div class="mp-alert mp-alert--${type}" role="${type === "error" ? "alert" : "status"}">${msg}</div>`;
}

const CHANNEL_UI = [
  { key: "email_marketing", field: "consent_email" },
  { key: "sms_marketing", field: "consent_sms" },
  { key: "whatsapp_marketing", field: "consent_whatsapp" },
];

export async function mountAccountApp(root) {
  if (!isConfigured()) {
    root.hidden = false;
    root.innerHTML = alertHtml("info", "Espace compte en cours d'activation.");
    return;
  }

  if (isRecoveryFlow()) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") !== "reset-password") {
      window.location.replace(`${readMarketplaceConfig().paths.account}?view=reset-password${window.location.hash}`);
      return;
    }
  }

  const supabase = getSupabase();
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view") || "dashboard";

  if (params.get("mode")) return;

  if (view === "reset-password") {
    root.hidden = false;
    const { session, reason } = await getValidSession(supabase);
    if (!session) {
      root.innerHTML = `<div class="container mp-account">${alertHtml(
        "error",
        reason === "session_expired"
          ? "Le lien de réinitialisation a expiré. Demandez un nouveau lien."
          : "Ouvrez le lien reçu par email pour définir votre mot de passe.",
      )}<p><a href="?mode=reset">Mot de passe oublié</a></p></div>`;
      return;
    }
    root.innerHTML = `
      <div class="container mp-account">
        <h2>Nouveau mot de passe</h2>
        <form id="mp-new-password" class="mp-form">
          <label>Nouveau mot de passe<input name="password" type="password" minlength="8" autocomplete="new-password" required /></label>
          <label>Confirmer<input name="password2" type="password" minlength="8" autocomplete="new-password" required /></label>
          <button type="submit" class="btn btn--primary">Enregistrer</button>
        </form>
        <div id="mp-reset-feedback"></div>
      </div>`;
    const feedback = root.querySelector("#mp-reset-feedback");
    root.querySelector("#mp-new-password").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const p1 = String(fd.get("password"));
      const p2 = String(fd.get("password2"));
      if (p1 !== p2) {
        feedback.innerHTML = alertHtml("error", "Les mots de passe ne correspondent pas.");
        return;
      }
      const result = await runWithNetwork(feedback, () => supabase.auth.updateUser({ password: p1 }));
      if (result?.error === "network") return;
      const { error } = result;
      if (error) {
        feedback.innerHTML = alertHtml("error", "Échec de la mise à jour. Le lien a peut-être expiré.");
        return;
      }
      feedback.innerHTML = alertHtml("success", "Mot de passe enregistré. Vous pouvez utiliser votre compte.");
      setTimeout(() => {
        window.location.href = `${readMarketplaceConfig().paths.account}?view=dashboard`;
      }, 1500);
    });
    return;
  }

  const { session, reason } = await getValidSession(supabase);

  if (view === "confirm") {
    root.hidden = false;
    if (!session) {
      root.innerHTML = `<div class="container mp-account">${alertHtml(
        "info",
        "Email confirmé. Connectez-vous pour accéder à votre espace.",
      )}<p><a class="btn btn--primary" href="?mode=login">Se connecter</a></p></div>`;
      return;
    }
    root.innerHTML = `<div class="container mp-account">${alertHtml(
      "success",
      "Adresse email confirmée. Vous pouvez déposer une annonce.",
    )}<p><a href="?view=consents">Vérifier vos préférences commerciales</a></p></div>`;
    return;
  }

  if (!session) {
    redirectToLogin(reason === "session_expired" ? "session_expired" : undefined);
    return;
  }

  const uid = session.user.id;
  root.hidden = false;

  const consentState = await loadConsentState(supabase, uid);
  const needsConsentReview = !consentState.error && !consentState.hasAnyRecord;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", uid).single();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, make, model, model_year, status, rejection_reason_public, updated_at")
    .eq("owner_id", uid)
    .order("updated_at", { ascending: false });

  const consentsBanner = needsConsentReview
    ? alertHtml(
        "info",
        "Nous n'avons pas d'enregistrement fiable de vos préférences commerciales. Merci de confirmer vos choix dans « Préférences » (aucune case n'est cochée par défaut).",
      )
    : "";

  root.innerHTML = `
    <div class="container mp-account">
      ${consentsBanner}
      <header class="mp-account__head">
        <h2>Mon compte</h2>
        <button type="button" id="mp-logout" class="btn btn--secondary btn--dark">Déconnexion</button>
      </header>
      <nav class="mp-account__nav">
        <a href="?view=dashboard" class="${view === "dashboard" ? "is-active" : ""}">Mes annonces</a>
        <a href="?view=profile" class="${view === "profile" ? "is-active" : ""}">Profil</a>
        <a href="?view=consents" class="${view === "consents" ? "is-active" : ""}">Préférences</a>
      </nav>
      <div id="mp-account-panel"></div>
    </div>`;

  root.querySelector("#mp-logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = readMarketplaceConfig().paths.catalog;
  });

  const panel = root.querySelector("#mp-account-panel");

  if (view === "profile") {
    panel.innerHTML = `
      <form id="mp-profile-form" class="mp-form">
        <label>Prénom<input name="first_name" value="${profile?.first_name ?? ""}" required /></label>
        <label>Nom<input name="last_name" value="${profile?.last_name ?? ""}" required /></label>
        <label>Téléphone<input name="phone" value="${profile?.phone ?? ""}" required /></label>
        <label>Ville<input name="city" value="${profile?.city ?? ""}" required /></label>
        <label>Code postal<input name="postal_code" value="${profile?.postal_code ?? ""}" pattern="[0-9]{5}" required /></label>
        <button type="submit" class="btn btn--primary">Enregistrer</button>
      </form>
      <div id="mp-profile-feedback"></div>`;
    const feedback = panel.querySelector("#mp-profile-feedback");
    panel.querySelector("#mp-profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const result = await runWithNetwork(feedback, () =>
        supabase
          .from("profiles")
          .update({
            first_name: fd.get("first_name"),
            last_name: fd.get("last_name"),
            phone: fd.get("phone"),
            city: fd.get("city"),
            postal_code: fd.get("postal_code"),
          })
          .eq("id", uid),
      );
      if (result?.error === "network") return;
      const { error } = result;
      feedback.innerHTML = error
        ? alertHtml("error", "Enregistrement échoué.")
        : alertHtml("success", "Profil enregistré.");
    });
    return;
  }

  if (view === "consents") {
    const state = await loadConsentState(supabase, uid);
    if (state.error) {
      panel.innerHTML = alertHtml("error", "Impossible de charger vos préférences.");
      return;
    }
    const latest = state.latest;
    panel.innerHTML = `
      <form id="mp-consent-form" class="mp-form">
        <fieldset class="mp-consents">
          <legend>Communications commerciales</legend>
          ${CHANNEL_UI.map(
            ({ key, field }) =>
              `<label><input type="checkbox" name="${field}" ${latest[key]?.granted ? "checked" : ""} /> ${CONSENT_TEXT[key]}</label>`,
          ).join("")}
        </fieldset>
        <button type="submit" class="btn btn--primary">Mettre à jour</button>
      </form>
      <div id="mp-consent-feedback"></div>
      <h3>Historique</h3>
      <table class="mp-table"><thead><tr><th>Date</th><th>Canal</th><th>Choix</th></tr></thead>
      <tbody>${(state.history ?? [])
        .slice(0, 30)
        .map(
          (r) =>
            `<tr><td>${new Date(r.recorded_at).toLocaleString("fr-FR")}</td><td>${r.channel}</td><td>${r.granted ? "Accepté" : "Refusé / révoqué"}</td></tr>`,
        )
        .join("")}</tbody></table>`;

    const feedback = panel.querySelector("#mp-consent-feedback");
    panel.querySelector("#mp-consent-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const choices = {
        email_marketing: Boolean(fd.get("consent_email")),
        sms_marketing: Boolean(fd.get("consent_sms")),
        whatsapp_marketing: Boolean(fd.get("consent_whatsapp")),
      };
      const result = await runWithNetwork(feedback, () =>
        persistConsentChoices(supabase, uid, choices, latest),
      );
      if (result?.error === "network") return;
      if (!result.ok) {
        feedback.innerHTML = alertHtml("error", "Échec de l'enregistrement.");
        return;
      }
      if (result.unchanged) {
        feedback.innerHTML = alertHtml("info", "Aucun changement par rapport à l'enregistrement actuel.");
        return;
      }
      window.location.href = "?view=consents&saved=1";
    });
    if (params.get("saved") === "1") {
      panel.insertAdjacentHTML("afterbegin", alertHtml("success", "Préférences enregistrées."));
    }
    return;
  }

  const cfg = readMarketplaceConfig();
  const rows = (listings ?? [])
    .map((l) => {
      const statusLabel = {
        draft: "Brouillon",
        pending_review: "En attente de validation",
        published: "Publiée",
        rejected: "Refusée",
        withdrawn: "Retirée",
        sold: "Vendue",
        expired: "Expirée",
      }[l.status] ?? l.status;
      const edit = l.status === "draft" || l.status === "rejected" ? ` · <a href="${cfg.paths.publish}?id=${l.id}">Modifier</a>` : "";
      return `<tr><td>${l.make} ${l.model} ${l.model_year}${edit}</td><td>${statusLabel}</td><td>${l.rejection_reason_public ?? "—"}</td></tr>`;
    })
    .join("");

  panel.innerHTML = `
    <p><a class="btn btn--primary" href="${cfg.paths.publish}">Déposer une annonce</a></p>
    <table class="mp-table">
      <thead><tr><th>Véhicule</th><th>Statut</th><th>Motif</th></tr></thead>
      <tbody>${rows || "<tr><td colspan=\"3\">Aucune annonce pour le moment.</td></tr>"}</tbody>
    </table>`;
}
