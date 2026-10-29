# Protocole test FormSubmit — `[TEST]` (autorisation propriétaire requise)

**Ne pas exécuter en production sans autorisation explicite.**

## Objectif

Vérifier la chaîne réelle : navigateur → FormSubmit → boîte `contact@redkmotors.fr` (et non seulement `/merci/`).

## Préparation

1. Autorisation écrite / orale du propriétaire.
2. Accès Gmail / webmail de `contact@redkmotors.fr` (et spam).
3. Navigateur : un parcours avec cookies refusés, un avec analytics acceptés.

## Sujets (champ `_subject` ou message)

- Particulier : `[TEST] Demande RDV particulier — ne pas traiter`
- Pro : `[TEST] Demande Pro — ne pas traiter`

Inclure un horodatage ISO dans le message.

## Étapes

1. Remplir `/contact/` — valider — noter l’heure locale.
2. Observer : bouton « Envoi en cours… », puis `/merci/?source=form`.
3. Sur `/merci/` : titre « Demande initiée » uniquement si jeton session (pas si URL ouverte à froid).
4. Répéter depuis `/professionnels/` (parcours Pro).
5. Dans la messagerie : chercher `[TEST]` — noter délai, dossier (reçus / spam), expéditeur FormSubmit.
6. Supprimer les messages de test.

## Interprétation

| Observation | Conclusion |
|-------------|------------|
| `/merci/` + jeton, e-mail reçu | Chaîne OK jusqu’à la boîte |
| `/merci/` + jeton, pas d’e-mail | FormSubmit ou filtre messagerie — ≠ bug affichage |
| `/merci/` sans jeton | Accès URL seul — pas une preuve d’envoi |
| Bounce / 550 | Voir diagnostic MX ; 550 destinataire ≠ forcément SPF |

## Tracking

Avec consentement : `form_submit_contact` / `form_submit_pro` puis éventuellement `form_submit_redirect` + `form_submit_success`.  
Sans consentement : formulaire fonctionne, **aucun** event GA4.
