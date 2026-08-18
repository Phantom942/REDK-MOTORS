function applyResponseHeaders(response, path) {
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
}

async function fetchWithHeaders(request, path) {
  return applyResponseHeaders(await fetch(request), path);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith(".html")) {
      // Fichiers racine requis tels quels (Google Search Console, etc.)
      if (/^\/google[a-f0-9]+\.html$/i.test(path)) {
        return fetchWithHeaders(request, path);
      }
      const dest = new URL(path.slice(0, -5) + "/" + url.search, "https://redkmotors.fr");
      return Response.redirect(dest.toString(), 301);
    }

    const bucket = path.charAt(1) || "_";
    const keys =
      bucket === "e"
        ? ["r:en", "r:eq", "r:ex0", "r:ex1", "r:ex2", "r:ex3"]
        : [`r:${bucket}`];

    for (const key of keys) {
      let shard = await env.REDIRECTS.get(key, { type: "json" });
      if (typeof shard === "string") {
        try {
          shard = JSON.parse(shard);
        } catch {
          /* ignore malformed shard */
        }
      }
      const targetPath = shard?.[path];
      if (targetPath && targetPath !== path) {
        const dest = new URL(targetPath, "https://redkmotors.fr");
        dest.search = url.search;
        return Response.redirect(dest.toString(), 301);
      }
    }

    return fetchWithHeaders(request, path);
  },
};
