# Migration DNS — redkmotors.fr → GitHub Pages

Fichier CSV prêt à importer : `dns_zone_redkmotors.fr.csv` (à la racine du repo).

## Modifications par rapport à l’ancienne zone Amen

| Enregistrement | Avant | Après |
|----------------|-------|-------|
| `redkmotors.fr` A | `81.88.57.68` (hébergement Amen) | 4 IP GitHub Pages |
| `www.redkmotors.fr` CNAME | `onstatic-fr.setupdns.net` | `phantom942.github.io` |

**Conservé tel quel** : MX, SPF, webmail, autoconfig, smtp, mail (messagerie Amen / securemail.pro).

## Après import DNS sur Amen

1. GitHub → repo **REDK-MOTORS** → **Settings → Pages** → Custom domain : `redkmotors.fr`
2. Attendre le certificat HTTPS (quelques minutes à 24 h)
3. Cocher **Enforce HTTPS**
4. Si GitHub demande une vérification TXT `_github-pages-challenge`, l’ajouter dans la zone puis re-vérifier
5. TXT Apple (Business / Mail) : `"apple-domain-verification=GWVEwuXbO8Ocntq0"` sur `@` — ne pas supprimer le SPF existant

## Redirections (autres domaines, chez le registrar)

- `redk-motors.me` → 301 → `https://redkmotors.fr`
- `red-kmotors.fr` → 301 → `https://redkmotors.fr`
- `red-kmotors.com` → 301 → `https://redkmotors.fr`
