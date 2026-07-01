/**
 * Affectation unique des avis Google par page.
 * Chaque auteur n'apparaît qu'une seule fois sur tout le site.
 * Correspondance thématique selon le type de réparation.
 */
const assignments = {
  index: ["Moove City", "Tommaso Mignano", "Fadoua Zah"],

  diagnostic: ["Sekou S", "Dhélia S"],
  freinage: ["loubna bellakhdar", "Anonyme Anonyme"],
  revision: ["Mutekiii Ryu", "amin c"],
  carrosserie: ["Rania Khorchid", "Kitoune Massinissa"],
  mecanique: ["Nawel Kamerji", "RafiK Kettal"],
  "pare-brise": ["soukouna mahamadou", "Youssra Trabelsi"],
  pneumatiques: ["Ryhane Henouda", "Adlène Benattia"],
  vidange: ["W F", "kal f."],

  "prestation-recherche-de-panne": ["ibraa750"],
  "prestation-diagnostic-voyant-moteur": ["Lucien cosa"],
  "prestation-embrayage": ["Tristan Vallade"],
  "prestation-montage-equilibrage": ["Issa Fofana"],
  "prestation-decalaminage-moteur": ["Zayneb Dioum"],
};

function validateUniqueAssignments(map) {
  const seen = new Map();
  for (const [pageId, authors] of Object.entries(map)) {
    for (const author of authors) {
      if (seen.has(author)) {
        throw new Error(
          `reviewPages.js : "${author}" est assigné à "${seen.get(author)}" et "${pageId}".`
        );
      }
      seen.set(author, pageId);
    }
  }
}

validateUniqueAssignments(assignments);

module.exports = assignments;
