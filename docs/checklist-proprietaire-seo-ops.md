# Checklist propriétaire — ce que le code ne fait pas

À faire côté **vous / ops** (le repo et la CI couvrent le reste).

## Cloudflare (301 blog + headers)

- [ ] Après chaque gros changement de redirects : importer `cloudflare-bulk-redirects.csv` ou lancer le workflow **Deploy blog redirects KV**
- [ ] Vérifier strict : workflow **Verify blog redirects** (ou `npm run verify:blog-redirects:prod:all`)
- [ ] Headers Worker : `npm run cf:deploy-headers` si smoke CI signale cache fonts ⚠

## Google Search Console

- [ ] Filtre requête **garage ivry** → noter position + URL (Pages)
- [ ] **Demander l’indexation** (quota ~10/j) : `/garage-ivry-sur-seine/`, `/reparation-climatisation-ivry/`, articles à fort volume
- [ ] Mensuel : `docs/seo-geo-monitoring-mensuel.md`

## GTM / GA4

- [ ] GTM Preview + GA4 DebugView : événements `click_call`, `click_whatsapp`, `form_submit_success`
- [ ] Marquer ces événements comme **conversions** dans GA4
- [ ] Checklist détaillée : `docs/seo-local-phase2-30jours.md`

## Secrets GitHub (optionnel)

- [ ] `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACES_PLACE_ID` → avis/note à jour à chaque build

## FormSubmit

- [ ] Tester le formulaire contact en prod (e-mail reçu dans `contact@redkmotors.fr`)
