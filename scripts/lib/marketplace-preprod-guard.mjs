/**
 * Garde-fous pour scripts marketplace **préproduction** uniquement.
 * - Refuse localhost (utiliser test:marketplace:local / e2e locaux).
 * - Refuse si l’URL Supabase ne correspond pas au projet préprod autorisé.
 * - Refuse si le projet correspond à la prod déclarée.
 * - Refuse l’hôte site production redkmotors.fr (sans sous-domaine preprod).
 */
import { isLocalSupabaseUrl } from "./marketplace-local-guard.mjs";

const PROD_SITE_HOSTS = new Set(["redkmotors.fr", "www.redkmotors.fr"]);

export function parseSupabaseProjectRef(supabaseUrl) {
  if (!supabaseUrl || typeof supabaseUrl !== "string") return null;
  try {
    const u = new URL(supabaseUrl.replace(/\/$/, ""));
    const m = u.hostname.match(/^([a-z0-9]+)\.supabase\.co$/i);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function assertPreprodRunAllowed() {
  const token = process.env.MARKETPLACE_PREPROD_ALLOW_RUN;
  if (token !== "preprod-redkmotors-smoke") {
    throw new Error(
      "Refus : définir MARKETPLACE_PREPROD_ALLOW_RUN=preprod-redkmotors-smoke pour confirmer (aucun reset, cible préprod uniquement).",
    );
  }
}

/**
 * @returns {{ baseUrl: string, anonKey: string, projectRef: string }}
 */
export function requirePreprodEnv() {
  assertPreprodRunAllowed();

  const baseUrl = process.env.MARKETPLACE_PREPROD_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.MARKETPLACE_PREPROD_ANON_KEY;
  const allowedRef = process.env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF?.trim();
  const prodRef = process.env.MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF?.trim();

  if (!baseUrl || !anonKey) {
    throw new Error(
      "Variables requises : MARKETPLACE_PREPROD_SUPABASE_URL et MARKETPLACE_PREPROD_ANON_KEY.",
    );
  }
  if (!allowedRef) {
    throw new Error(
      "Variable requise : MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF (ref du projet Supabase préprod, ex. abcdefghijklmnop).",
    );
  }

  if (isLocalSupabaseUrl(baseUrl)) {
    throw new Error(
      "Refus : URL Supabase locale. Utilisez npm run test:marketplace:local ou test:marketplace:e2e — jamais test:marketplace:preprod.",
    );
  }

  const ref = parseSupabaseProjectRef(baseUrl);
  if (!ref) {
    throw new Error(`Refus : URL Supabase non reconnue (${baseUrl}). Attendu : https://<ref>.supabase.co`);
  }
  if (ref !== allowedRef) {
    throw new Error(
      `Refus : ref projet ${ref} ≠ MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF (${allowedRef}).`,
    );
  }
  if (prodRef && ref === prodRef) {
    throw new Error("Refus : la cible Supabase correspond à MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF (production).");
  }

  const siteUrl = process.env.MARKETPLACE_PREPROD_SITE_URL?.trim();
  if (siteUrl) {
    let host;
    try {
      host = new URL(siteUrl).hostname.toLowerCase();
    } catch {
      throw new Error(`MARKETPLACE_PREPROD_SITE_URL invalide : ${siteUrl}`);
    }
    if (PROD_SITE_HOSTS.has(host)) {
      throw new Error(
        `Refus : MARKETPLACE_PREPROD_SITE_URL pointe la production (${host}). Utiliser preprod.redkmotors.fr.`,
      );
    }
    const expectedHost = process.env.MARKETPLACE_PREPROD_SITE_HOST?.trim().toLowerCase() || "preprod.redkmotors.fr";
    if (host !== expectedHost) {
      throw new Error(`Refus : hôte site ${host} ≠ attendu ${expectedHost}.`);
    }
  }

  return { baseUrl, anonKey, projectRef: ref };
}
