/**
 * Génère src/_data/blogKeywords.js — 1 principal + 2 secondaires + longue traîne par slug.
 * Exécution : node scripts/generate-blog-keywords.js
 */
const fs = require("fs");
const path = require("path");

const SLUG_META = {
  "5-points-controle-avant-ct-ivry": {
    primary: "points contrôle technique avant CT",
    secondary: ["checklist contrôle technique", "préparer voiture CT"],
    longTail: ["points à vérifier avant contrôle technique Ivry 94", "liste contrôle technique 2026"],
  },
  "adblue-voyant-panne-diesel": {
    primary: "voyant AdBlue allumé",
    secondary: ["panne AdBlue diesel", "autonomie AdBlue"],
    longTail: ["que faire voyant AdBlue diesel Euro 6", "recharge AdBlue garage 94"],
  },
  "alternateur-hs-symptomes": {
    primary: "alternateur HS symptômes",
    secondary: ["panne alternateur voiture", "voyant batterie allumé"],
    longTail: ["comment savoir si alternateur est mort", "alternateur à changer Ivry"],
  },
  "amortisseurs-usures-symptomes": {
    primary: "amortisseurs usés symptômes",
    secondary: ["usure amortisseur voiture", "tenue de route amortisseurs"],
    longTail: ["quand changer amortisseurs avant arrière", "amortisseurs fatigués bruit"],
  },
  "batterie-morte-matin-que-faire": {
    primary: "batterie morte le matin que faire",
    secondary: ["voiture ne démarre pas froid", "batterie voiture déchargée"],
    longTail: ["batterie à plat au réveil que faire", "dépannage batterie Ivry 94"],
  },
  "batterie-start-stop-usure-prematuree": {
    primary: "batterie start-stop usure",
    secondary: ["batterie AGM start stop", "durée vie batterie start stop"],
    longTail: ["batterie start stop usée trop vite", "changer batterie start stop 94"],
  },
  "batterie-voiture-quand-changer": {
    primary: "quand changer batterie voiture",
    secondary: ["durée vie batterie auto", "signes batterie faible"],
    longTail: ["batterie voiture combien d'années", "remplacement batterie garage Ivry"],
  },
  "bougies-allumage-quand-changer": {
    primary: "bougies d'allumage quand changer",
    secondary: ["intervalle changement bougies", "bougies usées symptômes"],
    longTail: ["bougies essence à changer tous les combien km", "bougies moteur ratés allumage"],
  },
  "bruit-anormal-voiture-que-faire": {
    primary: "bruit anormal voiture que faire",
    secondary: ["bruit moteur suspension", "diagnostic bruit auto"],
    longTail: ["bruit au freinage ou accélération que faire", "identifier bruit voiture garage"],
  },
  "cardan-qui-claque-causes": {
    primary: "cardan qui claque",
    secondary: ["joint cardan usé", "bruit cardan virage"],
    longTail: ["cardan claque en braquant causes", "remplacement cardan prix 94"],
  },
  "catalyseur-bouche-symptomes-causes": {
    primary: "catalyseur bouché symptômes",
    secondary: ["panne catalyseur voiture", "perte puissance catalyseur"],
    longTail: ["catalyseur encrassé que faire", "catalyseur à changer diesel"],
  },
  "clim-odeur-moisi-que-faire": {
    primary: "climatisation odeur moisi",
    secondary: ["odeur humidité clim voiture", "nettoyage évaporateur clim"],
    longTail: ["clim sent mauvais que faire", "désinfection climatisation auto Ivry"],
  },
  "climatisation-voiture-recharge-ivry": {
    primary: "recharge climatisation voiture",
    secondary: ["clim ne refroidit plus", "gaz climatisation auto"],
    longTail: ["recharge clim voiture Ivry-sur-Seine", "prix recharge clim 94"],
  },
  "combien-coute-vidange-voiture": {
    primary: "prix vidange voiture",
    secondary: ["combien coûte une vidange", "tarif vidange garage"],
    longTail: ["prix vidange voiture 2026 France", "vidange garage indépendant 94"],
  },
  "combien-temps-entre-deux-vidanges": {
    primary: "intervalle entre deux vidanges",
    secondary: ["fréquence vidange voiture", "vidange tous les combien km"],
    longTail: ["combien de km entre deux vidanges", "vidange annuelle obligatoire"],
  },
  "compresseur-clim-mort-symptomes": {
    primary: "compresseur clim mort symptômes",
    secondary: ["panne compresseur climatisation", "clim plus de froid"],
    longTail: ["compresseur clim HS bruit", "changer compresseur clim prix"],
  },
  "consommation-huile-anormale-causes": {
    primary: "consommation huile anormale",
    secondary: ["voiture consomme de l'huile", "niveau huile baisse"],
    longTail: ["consommation huile excessive causes moteur", "huile moteur qui disparaît"],
  },
  "controle-antipollution-refuse-que-faire": {
    primary: "contrôle antipollution refusé que faire",
    secondary: ["visite antipollution contre-visite", "pollution CT refus"],
    longTail: ["contre-visite antipollution que faire", "réparer pour antipollution 94"],
  },
  "controle-technique-2026-nouveautes": {
    primary: "contrôle technique 2026 nouveautés",
    secondary: ["nouveau contrôle technique 2026", "règlement CT 2026"],
    longTail: ["changements contrôle technique 2026 France", "CT 2026 ce qui change"],
  },
  "courroie-accessoires-symptomes-usure": {
    primary: "courroie accessoires usée symptômes",
    secondary: ["courroie alternateur usure", "bruit courroie accessoires"],
    longTail: ["quand changer courroie accessoires", "courroie accessoires cassée"],
  },
  "courroie-distribution-quand-changer-94": {
    primary: "courroie distribution quand changer",
    secondary: ["kit distribution intervalle", "courroie distribution cassée"],
    longTail: ["changement courroie distribution 94 prix", "distribution tous les combien km"],
  },
  "crevaison-reparer-ou-changer-pneu": {
    primary: "crevaison réparer ou changer pneu",
    secondary: ["réparation pneu crevé", "pneu hors service"],
    longTail: ["crevaison clou réparable ou pas", "changer pneu après crevaison"],
  },
  "debosselage-sans-peinture-dsp": {
    primary: "débosselage sans peinture DSP",
    secondary: ["enlever bosse carrosserie", "DSP carrosserie"],
    longTail: ["débosselage sans peinture prix Ivry", "bosse portière sans repeindre"],
  },
  "decalaminage-moteur-utile-ou-arnaque": {
    primary: "décalaminage moteur utile ou arnaque",
    secondary: ["nettoyage moteur hydrogène", "décalaminage diesel"],
    longTail: ["décalaminage moteur ça marche vraiment", "hydrogénation moteur avis"],
  },
  "demarreur-hs-symptomes": {
    primary: "démarreur HS symptômes",
    secondary: ["panne démarreur voiture", "voiture clique sans démarrer"],
    longTail: ["démarreur mort bruit clic", "changer démarreur prix 94"],
  },
  "direction-assistee-dure-grincements": {
    primary: "direction assistée dure grincements",
    secondary: ["crissement direction", "direction dure à froid"],
    longTail: ["direction assistée dure en virage", "liquide direction assistée"],
  },
  "disques-frein-voiles-usure-signes": {
    primary: "disques frein voilés usure",
    secondary: ["disque frein usé symptômes", "vibration freinage disque"],
    longTail: ["disques de frein voilés que faire", "rectifier ou changer disques frein"],
  },
  "embrayage-qui-patine-causes": {
    primary: "embrayage qui patine",
    secondary: ["embrayage usé symptômes", "patine embrayage causes"],
    longTail: ["embrayage patine côte causes", "changer embrayage prix 94"],
  },
  "entretien-voiture-eviter-pannes-ivry": {
    primary: "entretien voiture éviter pannes",
    secondary: ["entretien préventif auto", "révision entretien courant"],
    longTail: ["entretien voiture Ivry-sur-Seine", "éviter panne voiture usage ville"],
  },
  "fap-dpf-encrasse-trajets-ville": {
    primary: "FAP DPF encrassé trajets ville",
    secondary: ["filtre particules bouché", "régénération FAP"],
    longTail: ["FAP encrassé conduite urbaine que faire", "nettoyage FAP diesel 94"],
  },
  "filtre-gasoil-quand-changer": {
    primary: "filtre gasoil quand changer",
    secondary: ["filtre à carburant diesel", "intervalle filtre gasoil"],
    longTail: ["changer filtre gasoil tous les combien km", "filtre gasoil bouché symptômes"],
  },
  "filtre-habitacle-pollen-quand-changer": {
    primary: "filtre habitacle pollen quand changer",
    secondary: ["filtre pollen voiture", "filtre climatisation habitacle"],
    longTail: ["filtre habitacle à changer fréquence", "odeur clim filtre pollen"],
  },
  "freinage-mou-pedale-spongieuse": {
    primary: "freinage mou pédale spongieuse",
    secondary: ["pédale frein molle", "liquide frein air circuit"],
    longTail: ["pédale de frein spongieuse causes", "frein mou dangereux que faire"],
  },
  "fuite-huile-moteur-causes-que-faire": {
    primary: "fuite huile moteur causes",
    secondary: ["voiture perd de l'huile", "tache huile sous moteur"],
    longTail: ["fuite huile moteur que faire urgence", "réparer fuite huile garage"],
  },
  "fuite-liquide-frein-reconnaitre": {
    primary: "fuite liquide de frein",
    secondary: ["niveau liquide frein bas", "reconnaître fuite frein"],
    longTail: ["fuite liquide frein symptômes", "liquide frein rouge sous voiture"],
  },
  "fumee-blanche-echappement-que-faire": {
    primary: "fumée blanche échappement",
    secondary: ["fumée blanche au démarrage", "vapeur échappement"],
    longTail: ["fumée blanche échappement que faire", "fumée blanche joint culasse"],
  },
  "fumee-bleue-echappement-causes": {
    primary: "fumée bleue échappement causes",
    secondary: ["voiture fume bleu", "consommation huile fumée bleue"],
    longTail: ["fumée bleue moteur essence causes", "segments moteur fumée bleue"],
  },
  "garage-independant-vs-concessionnaire": {
    primary: "garage indépendant vs concessionnaire",
    secondary: ["entretien garage indépendant", "révision chez concession"],
    longTail: ["garage indépendant ou concessionnaire avantages", "prix entretien indépendant 94"],
  },
  "geometrie-roues-signes-mauvais-alignement": {
    primary: "géométrie roues mauvais alignement",
    secondary: ["parallelisme voiture", "voiture tire sur un côté"],
    longTail: ["signes mauvais parallelisme pneus", "géométrie roues prix 94"],
  },
  "injecteurs-encrasses-symptomes": {
    primary: "injecteurs encrassés symptômes",
    secondary: ["injecteur diesel bouché", "perte puissance injecteurs"],
    longTail: ["nettoyage injecteurs utile", "injecteurs encrassés broute"],
  },
  "joint-culasse-signes-symptomes": {
    primary: "joint de culasse symptômes",
    secondary: ["joint culasse HS signes", "surchauffe joint culasse"],
    longTail: ["comment savoir joint culasse HS", "joint culasse fumée mayonnaise"],
  },
  "liquide-frein-quand-changer": {
    primary: "liquide de frein quand changer",
    secondary: ["intervalle liquide frein", "DOT4 frein"],
    longTail: ["changer liquide frein tous les combien", "liquide frein foncé"],
  },
  "liquide-refroidissement-quand-verifier": {
    primary: "liquide refroidissement quand vérifier",
    secondary: ["niveau liquide refroidissement", "antigel moteur"],
    longTail: ["vérifier liquide refroidissement fréquence", "liquide refroidissement bas"],
  },
  "pare-brise-fissure-controle-technique": {
    primary: "pare-brise fissure contrôle technique",
    secondary: ["impact pare-brise CT", "fissure vitre avant CT"],
    longTail: ["pare-brise fissuré refus CT", "remplacement pare-brise 94"],
  },
  "peinture-localisee-retouche-carrosserie": {
    primary: "peinture localisée retouche carrosserie",
    secondary: ["retouche peinture auto", "rayure peinture réparer"],
    longTail: ["retouche peinture aile portière prix", "peinture localisée garage Ivry"],
  },
  "perte-puissance-soudaine-causes": {
    primary: "perte de puissance soudaine",
    secondary: ["voiture manque de puissance", "moteur étouffe"],
    longTail: ["perte puissance accélération causes", "voiture ne tire plus diesel"],
  },
  "plaquettes-frein-usure-signaux-a-ne-pas-ignorer": {
    primary: "plaquettes frein usées signaux",
    secondary: ["usure plaquettes frein", "changer plaquettes frein"],
    longTail: ["signes plaquettes frein usées", "plaquettes frein bruit sifflement"],
  },
  "pneus-ete-quand-passer-hiver-ile-de-france": {
    primary: "pneus été quand passer hiver",
    secondary: ["pneus hiver Île-de-France", "date pneus neige"],
    longTail: ["quand monter pneus hiver 94", "pneus été hiver date limite"],
  },
  "preparer-voiture-hiver-conseils": {
    primary: "préparer voiture pour l'hiver",
    secondary: ["entretien voiture hiver", "batterie froid hiver"],
    longTail: ["checklist voiture hiver Ivry", "conseils conduite hiver 94"],
  },
  "prix-changement-batterie-94": {
    primary: "prix changement batterie 94",
    secondary: ["tarif batterie voiture", "batterie auto prix posée"],
    longTail: ["prix batterie voiture Val-de-Marne", "changer batterie Ivry prix"],
  },
  "prix-changement-embrayage-94": {
    primary: "prix changement embrayage 94",
    secondary: ["tarif kit embrayage", "embrayage voiture prix"],
    longTail: ["prix embrayage complet 94", "changer embrayage Ivry devis"],
  },
  "prix-changement-plaquettes-frein-94": {
    primary: "prix changement plaquettes frein 94",
    secondary: ["tarif plaquettes frein", "frein avant prix"],
    longTail: ["prix plaquettes frein posées 94", "changer plaquettes Ivry"],
  },
  "prix-changement-pneus-94": {
    primary: "prix changement pneus 94",
    secondary: ["tarif montage pneus", "pneus voiture prix"],
    longTail: ["prix 4 pneus montés 94", "changer pneus Ivry-sur-Seine"],
  },
  "prix-diagnostic-auto-94": {
    primary: "prix diagnostic auto 94",
    secondary: ["tarif valise diagnostic", "diagnostic OBD prix"],
    longTail: ["prix diagnostic électronique Val-de-Marne", "diagnostic voiture Ivry prix"],
  },
  "prix-geometrie-parallelisme-94": {
    primary: "prix géométrie parallelisme 94",
    secondary: ["tarif parallelisme", "alignement roues prix"],
    longTail: ["prix géométrie 2 roues 94", "parallelisme Ivry tarif"],
  },
  "prix-kit-distribution-94": {
    primary: "prix kit distribution 94",
    secondary: ["tarif courroie distribution", "distribution posée prix"],
    longTail: ["prix changement distribution Val-de-Marne", "kit distribution Ivry"],
  },
  "prix-pre-controle-technique-ivry": {
    primary: "prix pré-contrôle technique Ivry",
    secondary: ["contre-visite CT prix", "préparation contrôle technique"],
    longTail: ["pré-contrôle technique Ivry-sur-Seine prix", "éviter contre-visite CT 94"],
  },
  "prix-recharge-climatisation-94": {
    primary: "prix recharge climatisation 94",
    secondary: ["tarif recharge clim", "gaz clim prix"],
    longTail: ["prix recharge clim Val-de-Marne", "recharge clim Ivry tarif"],
  },
  "quand-changer-pneus-usure-securite": {
    primary: "quand changer pneus usure",
    secondary: ["témoin usure pneu", "profondeur sculpture pneu"],
    longTail: ["pneus usés limite légale sécurité", "changer pneus avant hiver"],
  },
  "que-faire-apres-accident-carrosserie": {
    primary: "que faire après accident carrosserie",
    secondary: ["déclaration sinistre auto", "réparation carrosserie accident"],
    longTail: ["démarches après accrochage carrosserie", "carrosserie accident Ivry 94"],
  },
  "rayure-carrosserie-quand-reparer": {
    primary: "rayure carrosserie quand réparer",
    secondary: ["retouche rayure peinture", "rayure profonde carrosserie"],
    longTail: ["rayure portière réparer ou pas", "rayure carrosserie prix Ivry"],
  },
  "revision-60000-km-checklist": {
    primary: "révision 60000 km checklist",
    secondary: ["entretien 60 000 km", "grand entretien voiture"],
    longTail: ["que faire révision 60000 km", "révision 60 000 km prix"],
  },
  "revision-constructeur-que-comprend-vraiment-service": {
    primary: "révision constructeur que comprend",
    secondary: ["entretien carnet constructeur", "opérations révision officielle"],
    longTail: ["contenu révision constructeur détail", "révision réseau vs indépendant"],
  },
  "revision-garage-independant-garantie-constructeur": {
    primary: "révision garage indépendant garantie",
    secondary: ["entretien hors réseau garantie", "Loi Hamon entretien auto"],
    longTail: ["garage indépendant préserve garantie constructeur", "révision indépendant carnet"],
  },
  "revision-kilometrage-usage-urbain-94": {
    primary: "révision kilométrage usage urbain",
    secondary: ["entretien voiture ville", "intervalle révision trajets courts"],
    longTail: ["révision voiture usage urbain 94", "entretien conduite ville Ivry"],
  },
  "rotule-biellette-direction-quand-changer": {
    primary: "rotule direction quand changer",
    secondary: ["biellette direction usée", "jeu direction rotule"],
    longTail: ["rotule de direction symptômes usure", "changer rotule direction prix"],
  },
  "roulement-roue-sifflement-symptomes": {
    primary: "roulement roue sifflement",
    secondary: ["roulement avant HS", "bruit roue à vitesse"],
    longTail: ["sifflement roulement roue causes", "changer roulement roue prix"],
  },
  "silentblocs-triangles-suspension-usure": {
    primary: "silentblocs triangles suspension usure",
    secondary: ["triangle suspension jeu", "silentbloc HS symptômes"],
    longTail: ["silentblocs usés bruit claquement", "changer triangles suspension"],
  },
  "suppression-fap-controle-technique-2026": {
    primary: "suppression FAP contrôle technique 2026",
    secondary: ["FAP retiré CT", "contre-visite FAP"],
    longTail: ["suppression FAP légalité CT 2026", "FAP supprimé refus CT"],
  },
  "surchauffe-moteur-que-faire": {
    primary: "surchauffe moteur que faire",
    secondary: ["voyant température allumé", "moteur surchauffe urgence"],
    longTail: ["surchauffe moteur conduite que faire", "moteur qui chauffe arrêt"],
  },
  "turbo-compresseur-symptomes-panne": {
    primary: "turbo compresseur symptômes panne",
    secondary: ["turbo HS diesel", "perte puissance turbo"],
    longTail: ["turbo qui siffle fume noir", "changer turbo prix 94"],
  },
  "vanne-egr-encrassee-symptomes": {
    primary: "vanne EGR encrassée symptômes",
    secondary: ["EGR bouchée diesel", "nettoyage vanne EGR"],
    longTail: ["vanne EGR encrassée perte puissance", "EGR à changer ou nettoyer"],
  },
  "vidange-boite-automatique-quand-faire": {
    primary: "vidange boîte automatique quand faire",
    secondary: ["huile boîte auto intervalle", "entretien boîte automatique"],
    longTail: ["vidange boîte auto tous les combien km", "boîte automatique huile noire"],
  },
  "voiture-broute-acceleration-causes-94": {
    primary: "voiture broute à l'accélération",
    secondary: ["ratés accélération diesel", "manque de puissance accélération"],
    longTail: ["voiture broute en accélérant causes 94", "broute moteur diesel EGR"],
  },
  "voiture-ne-demarre-pas-causes": {
    primary: "voiture ne démarre pas causes",
    secondary: ["panne démarrage auto", "moteur ne tourne pas"],
    longTail: ["voiture ne démarre plus le matin", "diagnostic voiture ne démarre pas"],
  },
  "voiture-occasion-checklist-achat": {
    primary: "checklist achat voiture occasion",
    secondary: ["contrôler voiture occasion", "points vérifier occasion"],
    longTail: ["liste vérification voiture d'occasion", "acheter occasion sans arnaque"],
  },
  "volant-qui-vibre-causes": {
    primary: "volant qui vibre causes",
    secondary: ["vibration volant freinage", "volant tremble vitesse"],
    longTail: ["volant vibre à 100 km/h causes", "équilibrage roues vibration"],
  },
  "voyant-abs-allume-causes-conduite": {
    primary: "voyant ABS allumé causes",
    secondary: ["panne ABS voiture", "conduire avec ABS allumé"],
    longTail: ["voyant ABS fixe que faire", "capteur ABS défaillant"],
  },
  "voyant-moteur-allume-que-faire": {
    primary: "voyant moteur allumé que faire",
    secondary: ["diagnostic OBD voyant moteur", "voyant moteur orange rouge"],
    longTail: ["diagnostic voyant moteur Ivry 94", "peut-on rouler voyant moteur"],
  },
};

const slugs = fs
  .readdirSync(path.join(__dirname, "../src/blog/articles"))
  .filter((f) => f.endsWith(".njk"))
  .map((f) => f.replace(".njk", ""));

const missing = slugs.filter((s) => !SLUG_META[s]);
if (missing.length) {
  console.error("Slugs sans mots-clés:", missing.join(", "));
  process.exit(1);
}

const out = `/**
 * Mots-clés SEO par article — formation Blogging & SEO.
 * 1 principal + 2 secondaires + longue traîne (requêtes qualifiées).
 * Source de vérité pour articleSchema.keywords et relecture éditoriale.
 */
module.exports = ${JSON.stringify(SLUG_META, null, 2)
  .replace(/"([^"]+)":/g, '"$1":')
  .replace(/"primary":/g, "primary:")
  .replace(/"secondary":/g, "secondary:")
  .replace(/"longTail":/g, "longTail:")};
`;

// Pretty-print with unquoted keys for slugs - use manual format instead
let js = `/**
 * Mots-clés SEO par article — formation Blogging & SEO.
 * 1 principal + 2 secondaires + longue traîne (requêtes qualifiées).
 * Source de vérité pour articleSchema.keywords et relecture éditoriale.
 */
module.exports = {\n`;

for (const slug of slugs.sort()) {
  const k = SLUG_META[slug];
  js += `  "${slug}": {\n`;
  js += `    primary: ${JSON.stringify(k.primary)},\n`;
  js += `    secondary: [${k.secondary.map((s) => JSON.stringify(s)).join(", ")}],\n`;
  js += `    longTail: [${k.longTail.map((s) => JSON.stringify(s)).join(", ")}],\n`;
  js += `  },\n`;
}
js += "};\n";

const target = path.join(__dirname, "../src/_data/blogKeywords.js");
fs.writeFileSync(target, js, "utf8");
console.log("Écrit:", target, "—", slugs.length, "articles");
