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

function shardKeysForPath(path) {
  const bucket = path.charAt(1) || "_";
  if (bucket === "e") {
    return ["r:en", "r:eq", "r:ex0", "r:ex1", "r:ex2", "r:ex3"];
  }
  return [`r:${bucket}`];
}

async function lookupRedirect(env, path) {
  for (const key of shardKeysForPath(path)) {
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
      return targetPath;
    }
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Fichiers racine Google Search Console : ne jamais rediriger
    if (/^\/google[a-f0-9]+\.html$/i.test(path)) {
      return fetchWithHeaders(request, path);
    }

    // 1) Lookup KV exact (y compris .html) → 301 unique vers la cible finale
    const exactTarget = await lookupRedirect(env, path);
    if (exactTarget) {
      const dest = new URL(exactTarget, "https://redkmotors.fr");
      dest.search = url.search;
      return Response.redirect(dest.toString(), 301);
    }

    // 2) .html sans entrée KV : normalise vers slash (comportement historique)
    if (path.endsWith(".html")) {
      const slashPath = `${path.slice(0, -5)}/`;
      const slashTarget = await lookupRedirect(env, slashPath);
      if (slashTarget) {
        const dest = new URL(slashTarget, "https://redkmotors.fr");
        dest.search = url.search;
        return Response.redirect(dest.toString(), 301);
      }
      const dest = new URL(slashPath + url.search, "https://redkmotors.fr");
      return Response.redirect(dest.toString(), 301);
    }

    return fetchWithHeaders(request, path);
  },
};
