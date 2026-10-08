import { getSupabase, isConfigured } from "./client.js";
import { CONSENT_TEXT, readMarketplaceConfig } from "./config.js";
import { signupMetadataFromForm } from "./consents.js";
import { getValidSession, isRecoveryFlow, loginReasonMessage, redirectToLogin, runWithNetwork } from "./session.js";

function showMessage(root, type, text) {
  root.innerHTML = `<div class="mp-alert mp-alert--${type}" role="${type === "error" ? "alert" : "status"}">${text}</div>`;
}

function authErrorMessage(error) {
  if (!error) return "Connexion impossible. Vérifiez email et mot de passe.";
  const msg = String(error.message ?? "").toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (msg.includes("email not confirmed")) {
    return "Confirmez votre adresse email avant de vous connecter.";
  }
  return "Connexion impossible. Vérifiez email et mot de passe.";
}

export async function mountAuthApp(root) {
  if (!isConfigured()) {
    showMessage(root, "info", "Espace compte en cours d'activation. Revenez prochainement.");
    root.hidden = false;
    return;
  }

  if (isRecoveryFlow()) {
    window.location.replace(`${readMarketplaceConfig().paths.account}?view=reset-password`);
    return;
  }

  const supabase = getSupabase();
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "login";
  const reason = params.get("reason");

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session && mode !== "reset") {
    window.location.href = `${readMarketplaceConfig().paths.account}?view=dashboard`;
    return;
  }

  root.hidden = false;
  root.innerHTML = `
    <div class="mp-auth container">
      <div class="mp-auth__tabs" role="tablist">
        <button type="button" class="mp-auth__tab${mode === "login" ? " is-active" : ""}" data-mode="login">Connexion</button>
        <button type="button" class="mp-auth__tab${mode === "signup" ? " is-active" : ""}" data-mode="signup">Inscription</button>
      </div>
      <div id="mp-auth-panel"></div>
    </div>`;

  const panel = root.querySelector("#mp-auth-panel");
  if (reason && loginReasonMessage(reason)) {
    panel.insertAdjacentHTML("beforeend", `<div class="mp-alert mp-alert--info" role="status">${loginReasonMessage(reason)}</div>`);
  }

  async function renderLogin() {
    panel.innerHTML = `
      <form id="mp-login-form" class="mp-form">
        <label>Email<input name="email" type="email" autocomplete="email" required /></label>
        <label>Mot de passe<input name="password" type="password" autocomplete="current-password" required /></label>
        <button type="submit" class="btn btn--primary" id="mp-login-submit">Se connecter</button>
        <div id="mp-login-feedback" aria-live="polite"></div>
        <p class="mp-form__meta"><a href="?mode=reset">Mot de passe oublié</a></p>
      </form>`;
    panel.querySelector("#mp-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector("#mp-login-submit");
      const feedback = form.querySelector("#mp-login-feedback");
      feedback.innerHTML = "";
      submitBtn.disabled = true;
      submitBtn.textContent = "Connexion…";
      const fd = new FormData(form);
      const result = await runWithNetwork(feedback, () =>
        supabase.auth.signInWithPassword({
          email: String(fd.get("email")),
          password: String(fd.get("password")),
        }),
      );
      if (result?.error === "network") {
        submitBtn.disabled = false;
        submitBtn.textContent = "Se connecter";
        return;
      }
      const { data, error } = result;
      if (error || !data.session) {
        feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">${authErrorMessage(error)}</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = "Se connecter";
        return;
      }
      const check = await getValidSession(supabase);
      if (!check.session) {
        feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Session enregistrée mais validation impossible (${check.reason ?? "erreur"}). Réessayez ou vérifiez votre connexion réseau.</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = "Se connecter";
        return;
      }
      window.location.href = `${readMarketplaceConfig().paths.account}?view=dashboard`;
    });
  }

  async function renderSignup() {
    panel.innerHTML = `
      <form id="mp-signup-form" class="mp-form">
        <label>Prénom<input name="first_name" autocomplete="given-name" required /></label>
        <label>Nom<input name="last_name" autocomplete="family-name" required /></label>
        <label>Email<input name="email" type="email" autocomplete="email" required /></label>
        <label>Téléphone<input name="phone" type="tel" autocomplete="tel" required /></label>
        <label>Ville<input name="city" autocomplete="address-level2" required /></label>
        <label>Code postal<input name="postal_code" pattern="[0-9]{5}" required /></label>
        <label>Mot de passe<input name="password" type="password" autocomplete="new-password" minlength="8" required /></label>
        <fieldset class="mp-consents">
          <legend>Communications commerciales (facultatif)</legend>
          <label><input type="checkbox" name="consent_email" /> ${CONSENT_TEXT.email_marketing}</label>
          <label><input type="checkbox" name="consent_sms" /> ${CONSENT_TEXT.sms_marketing}</label>
          <label><input type="checkbox" name="consent_whatsapp" /> ${CONSENT_TEXT.whatsapp_marketing}</label>
        </fieldset>
        <button type="submit" class="btn btn--primary">Créer mon compte</button>
      </form>`;
    panel.querySelector("#mp-signup-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const meta = signupMetadataFromForm(fd);

      const result = await runWithNetwork(panel, () =>
        supabase.auth.signUp({
          email: String(fd.get("email")),
          password: String(fd.get("password")),
          options: {
            data: meta,
            emailRedirectTo: `${window.location.origin}${readMarketplaceConfig().paths.account}?view=confirm`,
          },
        }),
      );
      if (result?.error === "network") return;
      const { error } = result;
      if (error) {
        showMessage(panel, "error", "Inscription refusée. Vérifiez les champs ou utilisez un autre email.");
        return;
      }

      panel.innerHTML = `<div class="mp-alert mp-alert--success" role="status">Compte créé. Consultez votre email pour confirmer l'adresse. Vos choix commerciaux sont enregistrés côté serveur lors de la création du compte — vous pourrez les modifier dans « Préférences » après connexion.</div>`;
    });
  }

  async function renderReset() {
    panel.innerHTML = `
      <form id="mp-reset-form" class="mp-form">
        <label>Email<input name="email" type="email" required /></label>
        <button type="submit" class="btn btn--primary">Recevoir le lien</button>
        <p class="mp-form__meta"><a href="?mode=login">Retour connexion</a></p>
      </form>`;
    panel.querySelector("#mp-reset-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = String(new FormData(e.target).get("email"));
      const result = await runWithNetwork(panel, () =>
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}${readMarketplaceConfig().paths.account}?view=reset-password`,
        }),
      );
      if (result?.error === "network") return;
      const { error } = result;
      if (error) {
        showMessage(panel, "error", "Envoi impossible. Réessayez plus tard.");
        return;
      }
      panel.innerHTML = `<div class="mp-alert mp-alert--success" role="status">Si un compte existe, un email vient d'être envoyé. Ouvrez le lien reçu pour choisir un nouveau mot de passe.</div>`;
    });
  }

  root.querySelectorAll(".mp-auth__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.dataset.mode;
      history.replaceState(null, "", `?mode=${m}`);
      if (m === "signup") renderSignup();
      else renderLogin();
      root.querySelectorAll(".mp-auth__tab").forEach((b) => b.class.toggle("is-active", b.dataset.mode === m));
    });
  });

  if (mode === "signup") await renderSignup();
  else if (mode === "reset") await renderReset();
  else await renderLogin();
}
