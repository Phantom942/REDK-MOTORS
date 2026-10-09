/**
 * Overlay marketplace — ne pas renvoyer tout `site` :
 * Eleventy fusionne avec site.json et concaténerait `nav` (doublons header).
 *
 * - Local : MARKETPLACE_TEST_URL + MARKETPLACE_TEST_ANON_KEY (localhost)
 * - Build distant : MARKETPLACE_BUILD_ENABLE=1 + MARKETPLACE_SUPABASE_* + MARKETPLACE_BUILD_TARGET=preprod|production
 */
const LOCAL_RE = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/;

function marketplaceOverlay(url, anonKey) {
  if (!url || !anonKey) return null;
  return {
    marketplace: {
      enabled: true,
      supabaseUrl: url,
      supabaseAnonKey: anonKey,
    },
  };
}

export default function marketplaceLocalOverlay() {
  const localUrl = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
  const localAnon = process.env.MARKETPLACE_TEST_ANON_KEY;
  if (localUrl && localAnon && LOCAL_RE.test(localUrl)) {
    return marketplaceOverlay(localUrl, localAnon) ?? {};
  }

  if (process.env.MARKETPLACE_BUILD_ENABLE === "1") {
    const target = process.env.MARKETPLACE_BUILD_TARGET;
    if (target !== "preprod" && target !== "production") {
      return {};
    }
    const url = process.env.MARKETPLACE_SUPABASE_URL?.replace(/\/$/, "");
    const anonKey = process.env.MARKETPLACE_SUPABASE_ANON_KEY;
    if (url && anonKey && !LOCAL_RE.test(url)) {
      return marketplaceOverlay(url, anonKey) ?? {};
    }
  }

  return {};
}
