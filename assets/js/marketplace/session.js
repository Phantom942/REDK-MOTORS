import { readMarketplaceConfig } from "./config.js";

export async function getValidSession(supabase) {
  const { data: sessionWrap, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionWrap.session) {
    return { session: null, reason: sessionErr ? "auth_error" : "no_session" };
  }
  const { data: userWrap, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userWrap.user) {
    await supabase.auth.signOut();
    return { session: null, reason: "session_expired" };
  }
  return { session: sessionWrap.session, user: userWrap.user };
}

export function redirectToLogin(reason) {
  const cfg = readMarketplaceConfig();
  const base = cfg?.paths?.account ?? "/achat-revente/compte/";
  const url = new URL(base, window.location.origin);
  url.searchParams.set("mode", "login");
  if (reason) url.searchParams.set("reason", reason);
  window.location.href = `${url.pathname}${url.search}`;
}

export function loginReasonMessage(reason) {
  if (reason === "session_expired") {
    return "Votre session a expiré. Reconnectez-vous pour continuer.";
  }
  if (reason === "network") {
    return "Connexion réseau impossible. Vérifiez votre accès internet et réessayez.";
  }
  return null;
}

export async function runWithNetwork(panel, fn) {
  try {
    return await fn();
  } catch {
    if (panel) {
      panel.insertAdjacentHTML(
        "beforeend",
        `<div class="mp-alert mp-alert--error" role="alert">Connexion réseau impossible. Réessayez dans un instant.</div>`,
      );
    }
    return { error: "network" };
  }
}

export function isRecoveryFlow() {
  const hash = window.location.hash || "";
  const params = new URLSearchParams(window.location.search);
  return hash.includes("type=recovery") || params.get("type") === "recovery";
}
