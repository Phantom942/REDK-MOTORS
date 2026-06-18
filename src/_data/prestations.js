const categories = [
  {
    key: "frequentes",
    title: "Prestations fréquentes",
    services: [
      { slug: "revision-entretien", name: "Révision et entretien" },
      { slug: "vidange-moteur", name: "Vidange moteur" },
      { slug: "pre-controle-technique", name: "Pré-contrôle technique" }
    ]
  },
  {
    key: "moteur",
    title: "Moteur",
    services: [
      { slug: "recherche-de-panne", name: "Recherche de panne" },
      { slug: "distribution-injection", name: "Distribution et injection" },
      { slug: "diagnostic-voyant-moteur", name: "Diagnostic voyant moteur" },
      { slug: "decalaminage-moteur", name: "Decalaminage moteur" }
    ]
  },
  {
    key: "suspension",
    title: "Suspension",
    services: [
      { slug: "amortisseurs", name: "Amortisseurs" },
      { slug: "coupelles-triangles", name: "Coupelles et triangles" },
      { slug: "geometrie", name: "Geometrie" }
    ]
  },
  {
    key: "pneus",
    title: "Pneus / Roues",
    services: [
      { slug: "montage-equilibrage", name: "Montage et equilibrage" },
      { slug: "permutation-pneus", name: "Permutation pneus" },
      { slug: "reparation-crevaison", name: "Reparation crevaison" }
    ]
  },
  {
    key: "batterie",
    title: "Batterie, alternateur, demarreur",
    services: [
      { slug: "test-batterie", name: "Test batterie" },
      { slug: "remplacement-batterie", name: "Remplacement batterie" },
      { slug: "controle-alternateur", name: "Controle alternateur" }
    ]
  },
  {
    key: "freinage",
    title: "Freinage",
    services: [
      { slug: "plaquettes-disques", name: "Plaquettes et disques" },
      { slug: "purge-liquide-frein", name: "Purge liquide de frein" },
      { slug: "diagnostic-abs", name: "Diagnostic ABS" }
    ]
  },
  {
    key: "transmission",
    title: "Transmission",
    services: [
      { slug: "embrayage", name: "Embrayage" },
      { slug: "cardans", name: "Cardans" },
      { slug: "vidange-boite", name: "Vidange de boite" }
    ]
  },
  {
    key: "climatisation",
    title: "Climatisation",
    services: [
      { slug: "recharge-clim", name: "Recharge clim" },
      { slug: "desinfection-circuit-clim", name: "Desinfection circuit clim" },
      { slug: "controle-compresseur", name: "Controle compresseur" }
    ]
  },
  {
    key: "carrosserie",
    title: "Carrosserie",
    services: [
      { slug: "debosselage", name: "Debosselage" },
      { slug: "peinture-localisee", name: "Peinture localisee" },
      { slug: "pare-brise-vitrage", name: "Pare-brise et vitrage" },
      { slug: "retouches-finitions", name: "Retouches et finitions" }
    ]
  }
];

function buildService(service, category) {
  const summary = `${service.name} a Ivry-sur-Seine : diagnostic, devis clair et intervention validee avant travaux.`;
  return {
    ...service,
    category,
    summary,
    lead: `Nos techniciens prennent en charge la prestation "${service.name}" avec une methode simple : controle, explication et validation avant intervention.`,
    bullets: [
      `Diagnostic complet pour ${service.name.toLowerCase()}`,
      "Devis detaille et transparent",
      "Pieces adaptees au vehicule",
      "Controle final avant restitution"
    ],
    process: [
      "Verification du vehicule et des besoins",
      "Chiffrage puis validation client",
      "Intervention en atelier",
      "Restitution avec compte-rendu"
    ],
    faq: [
      {
        q: `Quand faut-il prevoir ${service.name.toLowerCase()} ?`,
        a: "Des signes d'usure, un voyant ou un comportement anormal sont de bons indicateurs. Un controle rapide permet de confirmer."
      },
      {
        q: `Le tarif de ${service.name.toLowerCase()} est-il fixe ?`,
        a: "Le prix depend du modele, des pieces et du temps d'intervention. Nous annoncons toujours un devis avant de commencer."
      },
      {
        q: "Puis-je prendre rendez-vous rapidement ?",
        a: "Oui, nous proposons des creneaux rapides selon disponibilite. Contactez-nous par telephone ou WhatsApp."
      }
    ]
  };
}

const all = categories.flatMap((category) =>
  category.services.map((service) => buildService(service, category.title))
);

module.exports = {
  categories,
  all
};
