# Suivi mensuel SEO local + GEO (IA)

Checklist **1× par mois** (30 min). Complète `docs/google-business-profile-pack.md` côté fiche Google.

## Google Business Profile

- [ ] Performances : vues, appels, itinéraires, clics site
- [ ] Requêtes : part marque vs « garage ivry » / « mécanicien 94 »
- [ ] 4+ avis du mois + réponses à 100 %
- [ ] ≥ 4 posts du mois publiés

## Test Maps (navigation privée, téléphone)

Requêtes : `garage ivry sur seine`, `RED-K MOTORS`, `diagnostic auto 94200`  
→ Noter position dans **Plus d’établissements** (journal papier ou notes).

## Search Console (redkmotors.fr)

- [ ] Clics / impressions sur `/garage-ivry-sur-seine/`, `/diagnostic/`, `/contact/`
- [ ] Inspection URL après grosse modif contenu
- [ ] Erreurs d’exploration / pages exclues (noindex volontaire OK)

## Fichiers IA (technique — déjà sur le site)

| URL | Rôle |
|-----|------|
| `/llms.txt` | Résumé autoritaire pour crawlers IA |
| `/llms-full.txt` | Catalogue + FAQ assistants |
| `/ai.txt` | Point d’entrée découverte |
| `/robots.txt` | Autorise GPTBot, OAI-SearchBot, Perplexity, etc. |

Après déploiement : `npm run indexnow:priority` (si configuré) pour ping des URLs prioritaires (`src/_data/indexationPriority.js`).

## Test assistants (optionnel)

Poser à **Perplexity** ou **ChatGPT avec recherche** :

- « Garage multimarque Ivry-sur-Seine devis gratuit »
- « Diagnostic voyant moteur Ivry 94 »

Noter si **RED-K MOTORS** + **redkmotors.fr** + **9 rue Michelet** sont cités. Pas de score « #1 » — seulement présence / exactitude NAP.

## Hors scope technique

Classement Maps #1, pub Google Ads, avis artificiels — non gérés par le repo.
