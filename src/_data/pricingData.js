/**
 * Grille tarifaire indicative — source unique pour le tableau /tarifs/,
 * le schema OfferCatalog et le maillage vers /exemples/prix-…/
 */
const SITE_URL = "https://redkmotors.fr";

const rows = [
  {
    label: "Diagnostic auto",
    priceHtml: "50&nbsp;€ – 100&nbsp;€",
    offer: { name: "Diagnostic avancé (approfondi)", minPrice: 50, maxPrice: 100 },
  },
  {
    label: "Vidange voiture (huile + filtre)",
    priceHtml: "70&nbsp;€ – 150&nbsp;€",
    guideSlug: "prix-vidange-moteur",
    guideLabel: "Exemple vidange détaillé",
    offer: { name: "Vidange (huile + filtre)", minPrice: 70, maxPrice: 150, guideSlug: "prix-vidange-moteur" },
  },
  {
    label: "Révision voiture",
    priceHtml: "130&nbsp;€ – 400&nbsp;€",
    offer: { name: "Révision", minPrice: 130, maxPrice: 400 },
  },
  {
    label: "Changement plaquettes de frein",
    priceHtml: "100&nbsp;€ – 190&nbsp;€",
    guideSlug: "prix-plaquettes-frein",
    guideLabel: "Exemple freins détaillé",
    offer: { name: "Changement plaquettes de frein", minPrice: 100, maxPrice: 190, guideSlug: "prix-plaquettes-frein" },
  },
  {
    label: "Disques + plaquettes",
    priceHtml: "240&nbsp;€ – 590&nbsp;€",
    guideSlug: "prix-plaquettes-frein",
    guideLabel: "Guide plaquettes & disques",
    offer: { name: "Disques et plaquettes de frein", minPrice: 240, maxPrice: 590, guideSlug: "prix-plaquettes-frein" },
  },
  {
    label: "Parallélisme / géométrie",
    priceHtml: "80&nbsp;€ – 160&nbsp;€",
    offer: { name: "Parallélisme / géométrie", minPrice: 80, maxPrice: 160 },
  },
  {
    label: "Changement pneus (montage 4 + équilibrage)",
    priceHtml: "60&nbsp;€ – 150&nbsp;€",
    guideSlug: "prix-montage-pneus",
    guideLabel: "Exemple pneus détaillé",
    offer: { name: "Changement pneus (montage 4 + équilibrage)", minPrice: 60, maxPrice: 150, guideSlug: "prix-montage-pneus" },
  },
  {
    label: "Recharge climatisation",
    priceHtml: "40&nbsp;€",
    guideSlug: "prix-recharge-climatisation",
    guideLabel: "Exemple clim détaillé",
    offer: { name: "Recharge climatisation", price: 40, guideSlug: "prix-recharge-climatisation" },
  },
  {
    label: "Réparation climatisation (fuite, compresseur…)",
    priceHtml: "sur devis",
  },
  {
    label: "Changement batterie voiture",
    priceHtml: "120&nbsp;€ – 250&nbsp;€",
    guideSlug: "prix-batterie",
    guideLabel: "Exemple batterie détaillé",
    offer: { name: "Changement batterie voiture", minPrice: 120, maxPrice: 250, guideSlug: "prix-batterie" },
  },
  {
    label: "Amortisseurs (paire, pose incluse)",
    priceHtml: "380&nbsp;€ – 800&nbsp;€",
    offer: { name: "Amortisseurs (paire, pose incluse)", minPrice: 380, maxPrice: 800 },
  },
  {
    label: "Changement courroie distribution (kit + pose)",
    priceHtml: "450&nbsp;€ – 990&nbsp;€",
    guideSlug: "prix-courroie-distribution",
    guideLabel: "Exemple distribution détaillé",
    offer: { name: "Kit distribution (courroie + pose)", minPrice: 450, maxPrice: 990, guideSlug: "prix-courroie-distribution" },
  },
  {
    label: "Embrayage",
    priceHtml: "800&nbsp;€ – 1&nbsp;600&nbsp;€",
    guideSlug: "prix-embrayage",
    guideLabel: "Exemple embrayage détaillé",
    offer: { name: "Embrayage", minPrice: 800, maxPrice: 1600, guideSlug: "prix-embrayage" },
  },
  {
    label: "Réparation carrosserie",
    priceHtml: "Sur devis",
  },
  {
    label: "Préparation contrôle technique",
    priceHtml: "40&nbsp;€",
    offer: { name: "Pré-contrôle technique", price: 40 },
  },
];

function buildOfferElement(offer, baseUrl = SITE_URL) {
  const item = {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: offer.name },
  };
  if (offer.guideSlug) {
    item.url = `${baseUrl}/exemples/${offer.guideSlug}/`;
  }
  if (offer.price != null) {
    item.price = String(offer.price);
    item.priceCurrency = "EUR";
  } else if (offer.minPrice != null && offer.maxPrice != null) {
    item.priceSpecification = {
      "@type": "PriceSpecification",
      minPrice: String(offer.minPrice),
      maxPrice: String(offer.maxPrice),
      priceCurrency: "EUR",
    };
  }
  return item;
}

function buildOfferCatalogSchema(baseUrl = SITE_URL) {
  const offers = rows.filter((row) => row.offer).map((row) => buildOfferElement(row.offer, baseUrl));
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Tarifs indicatifs RED-K MOTORS",
    url: `${baseUrl}/tarifs/`,
    itemListElement: offers,
  };
}

module.exports = {
  rows,
  buildOfferCatalogSchema,
};
