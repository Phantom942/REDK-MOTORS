/**
 * Refuse toute opération destructive ou E2E hors Supabase local.
 */
const LOCAL_RE = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/;

export function isLocalSupabaseUrl(url) {
  if (!url || typeof url !== "string") return false;
  return LOCAL_RE.test(url.replace(/\/$/, ""));
}

export function assertLocalSupabaseUrl(url, context = "opération") {
  const u = url?.replace(/\/$/, "");
  if (!isLocalSupabaseUrl(u)) {
    throw new Error(
      `Refus ${context} : URL non locale (${u ?? "vide"}). Autorisé : 127.0.0.1 ou localhost uniquement.`,
    );
  }
  return u;
}

export function assertLocalOnlyEnv() {
  const url = process.env.MARKETPLACE_TEST_URL ?? process.env.SUPABASE_URL ?? process.env.API_URL;
  assertLocalSupabaseUrl(url, "test marketplace");
}
