/** @deprecated Neutralisé — plus de copies bucket public à la publication */
Deno.serve(() =>
  new Response(
    JSON.stringify({
      error: "deprecated",
      message: "Retirer les objets listing-photos-public manuellement si un ancien déploiement en a créé.",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } },
  ),
);
