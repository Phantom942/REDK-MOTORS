# Diagnostic messagerie — contact@redkmotors.fr (29 oct. 2026)

Contrôles DNS publics uniquement — **aucune modification DNS effectuée**.

## Enregistrements observés

| Type | Valeur |
|------|--------|
| MX | `mail-fr.securemail.pro` (pref 10) |
| SPF | `v=spf1 include:spf.webapps.net ~all` |
| DMARC | `v=DMARC1;p=reject;pct=100;` |
| DKIM (`google._domainkey`, `default._domainkey`, `s1._domainkey`, `mail._domainkey`) | **introuvables** au moment du contrôle |
| DNS autoritaire | Cloudflare (`elisabeth.ns.cloudflare.com`) |

## Interprétation

1. La boîte `contact@redkmotors.fr` est vraisemblablement hébergée chez un prestataire mail type **Securemail / Webapps** (MX + SPF `spf.webapps.net`), **pas** chez Google Workspace comme MX principal.
2. **DMARC `p=reject`** est strict : tout envoi qui échoue SPF/DKIM d’alignement risque le rejet.
3. L’absence de sélecteurs DKIM publics courants n’implique pas forcément l’absence totale de DKIM chez le prestataire (sélecteur propriétaire possible), mais **l’envoi via Gmail / alias Gmail « comme » redkmotors.fr** sans DKIM aligné + DMARC reject explique très bien les alertes Gmail / non-distribution.
4. Un SMTP `550 5.1.1` chez un **destinataire** indique le plus souvent une **adresse inexistante côté destinataire**, pas une panne de notre domaine.

## Actions recommandées (propriétaire / hébergeur mail)

1. Confirmer le panneau Securemail / Webapps : boîte `contact@` active, alias, quotas.
2. Publier le **DKIM officiel** fourni par le prestataire MX (TXT sous le sélecteur indiqué).
3. Si Gmail est utilisé pour **envoyer** en `contact@redkmotors.fr` : configurer « Envoyer des e-mails en tant que » + SPF/DKIM alignés, **ou** n’envoyer que depuis le webmail Securemail.
4. Tester : https://www.mail-tester.com / envoi interne + externe.
5. FormSubmit → `contact@redkmotors.fr` : vérifier dossier spam après autorisation `[TEST]`.

## Ne pas faire sans validation

- Modifier SPF/MX/DMARC Cloudflare à l’aveugle.
- Ajouter `include:_spf.google.com` sans stratégie d’envoi claire.
- Baisser `p=reject` sans plan (temporaire `p=none` uniquement pour debug).
