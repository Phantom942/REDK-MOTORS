/**
 * Overlay marketplace locale uniquement — ne pas renvoyer tout `site` :
 * Eleventy fusionne avec site.json et concaténerait `nav` (doublons header).
 */
export default function marketplaceLocalOverlay() {
  const url = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
  const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
  if (url && anonKey && /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(url)) {
    return {
      marketplace: {
        enabled: true,
        supabaseUrl: url,
        supabaseAnonKey: anonKey,
      },
    };
  }
  return {};
}
