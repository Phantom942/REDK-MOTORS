/** @deprecated Neutralisé — publication via bucket privé + serve-listing-photo */
Deno.serve(() =>
  new Response(
    JSON.stringify({
      error: "deprecated",
      message: "Utiliser apply_listing_approval + serve-listing-photo. Retirer ce déploiement côté Supabase.",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } },
  ),
);
