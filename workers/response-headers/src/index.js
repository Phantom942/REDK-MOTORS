/**
 * Cloudflare Worker — injecte les en-têtes _headers sur GitHub Pages (origin sans support natif).
 * Déploiement : npm run cf:deploy-headers
 */
export default {
  async fetch(request) {
    const response = await fetch(request);
    const url = new URL(request.url);
    const path = url.pathname;
    const headers = new Headers(response.headers);

    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

    if (path.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (
      path === "/ai.txt" ||
      path === "/llms.txt" ||
      path === "/llms-full.txt" ||
      path === "/robots.txt"
    ) {
      headers.set("Content-Type", "text/plain; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=86400");
    } else if (path === "/sitemap.xml" || /^\/sitemap-[^/]+\.xml$/.test(path)) {
      headers.set("Content-Type", "application/xml; charset=utf-8");
      headers.set("Cache-Control", "public, max-age=3600");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
