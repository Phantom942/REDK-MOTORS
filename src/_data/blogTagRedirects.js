/**
 * Tags blog orphelins → tag indexable canonique
 * (listés dans _redirects, vercel.json, redirects-map.csv — plus de stubs HTML).
 */
module.exports = [
  { from: "/blog/tag/revision-auto/", to: "/blog/tag/revision/", label: "Révision" },
  { from: "/blog/tag/plaquettes/", to: "/blog/tag/freins/", label: "Freinage" },
  { from: "/blog/tag/climatisation/", to: "/blog/tag/entretien/", label: "Entretien" },
  { from: "/blog/tag/tarifs/", to: "/blog/tag/conseils-auto/", label: "Conseils auto" },
  { from: "/blog/tag/embrayage/", to: "/blog/tag/mecanique/", label: "Mécanique" },
  { from: "/blog/tag/suspension/", to: "/blog/tag/mecanique/", label: "Mécanique" },
  { from: "/blog/tag/ivry-sur-seine/", to: "/blog/tag/conseils-auto/", label: "Conseils auto" },
  { from: "/blog/tag/reparation/", to: "/blog/tag/mecanique/", label: "Mécanique" },
  { from: "/blog/tag/pollution/", to: "/blog/tag/moteur/", label: "Moteur" },
  { from: "/blog/tag/allumage/", to: "/blog/tag/moteur/", label: "Moteur" },
  { from: "/blog/tag/refroidissement/", to: "/blog/tag/moteur/", label: "Moteur" },
  { from: "/blog/tag/courroie/", to: "/blog/tag/mecanique/", label: "Mécanique" },
  { from: "/blog/tag/turbo/", to: "/blog/tag/moteur/", label: "Moteur" },
  { from: "/blog/tag/electricite/", to: "/blog/tag/diagnostic/", label: "Diagnostic" },
  { from: "/blog/tag/boite-automatique/", to: "/blog/tag/entretien/", label: "Entretien" },
  { from: "/blog/tag/batterie/", to: "/blog/tag/mecanique/", label: "Mécanique" },
  { from: "/blog/tag/diesel/", to: "/blog/tag/moteur/", label: "Moteur" },
  { from: "/blog/tag/freinage/", to: "/blog/tag/freins/", label: "Freinage" },
  { from: "/blog/tag/pneus/", to: "/blog/tag/pneumatiques/", label: "Pneumatiques" },
];
