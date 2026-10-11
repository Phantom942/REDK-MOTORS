/**
 * Fiches annonces marketplace — SSR depuis Supabase (retrait sans rebuild GitHub Pages).
 * Route à attacher AVANT GitHub Pages : /achat-revente/vehicules/*
 *
 * Variables Worker (secrets) :
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 * - MARKETPLACE_ALLOW_INDEX (optionnel, "1" pour indexation moteurs)
 */

import {
  fetchPublicListingBySlug,
  listingSlugFromPath,
  renderListingPageHtml,
} from "./listing-page.mjs";

const NOT_FOUND_HTML = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Annonce indisponible</title></head><body><p>Cette annonce n'est plus disponible.</p><p><a href="/achat-revente/vehicules/">Catalogue</a></p></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("method_not_allowed", { status: 405 });
    }

    const slug = listingSlugFromPath(url.pathname);
    if (!slug) {
      return fetch(request);
    }

    const supabaseUrl = env.SUPABASE_URL;
    const anonKey = env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      return new Response("marketplace_listing_misconfigured", { status: 503 });
    }

    const payload = await fetchPublicListingBySlug(supabaseUrl, anonKey, slug);
    if (!payload) {
      return new Response(NOT_FOUND_HTML, {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    const allowIndex = env.MARKETPLACE_ALLOW_INDEX === "1";
    const html = renderListingPageHtml({
      payload,
      supabaseUrl,
      allowIndex,
    });

    const headers = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      "X-Robots-Tag": allowIndex ? "index, follow" : "noindex, follow",
    };

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }
    return new Response(html, { status: 200, headers });
  },
};
