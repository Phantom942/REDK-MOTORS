# Migration DNS — redk-motors.me → redkmotors.fr

Fichier CSV de référence : `dns_zone_redk-motors.me.csv`

## Verdict : ne pas réimporter le CSV

La zone actuelle est **déjà correcte** pour le setup GitHub Pages + redirect :

| Enregistrement | Valeur | Rôle |
|----------------|--------|------|
| `redk-motors.me` A ×4 | IP GitHub Pages | Apex → repo `redk-motors-me-redirect` |
| `www.redk-motors.me` CNAME | `phantom942.github.io` | www → GitHub Pages |
| MX / mail / SPF / DMARC | Inchangés | Messagerie Amen conservée |

**Le CSV ne permet pas un 301 HTTP avec conservation du chemin** — seulement des pointements DNS.

## Étape 4 — vrai 301 (hors CSV)

GitHub Pages ne sert qu’un soft redirect (JS). Pour le warning GSC « pages exemples », il faut un **301 serveur**.

### Option A — Cloudflare (recommandé, gratuit)

1. Créer un compte Cloudflare, ajouter `redk-motors.me`
2. Remplacer les NS chez Amen par ceux de Cloudflare (ou CNAME setup si proposé)
3. Recréer les enregistrements mail (MX, etc.) dans Cloudflare
4. **Redirect Rules** : `*redk-motors.me/*` → `https://redkmotors.fr/${uri.path}` — **301 Permanent**

### Option B — Amen micro-hébergement + .htaccess

1. Amen → `redk-motors.me` → activer **Micro-hébergement**
2. Association domaine → pointer le site sur le micro-hébergement (remplace GitHub pour le web)
3. Fichier `.htaccess` à la racine :

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?redk-motors\.me$ [NC]
RewriteRule ^(.*)$ https://redkmotors.fr/$1 [R=301,L]
```

4. Copier aussi `robots.txt` sur le micro-hébergement

### Option C — Garder GitHub Pages (actuel)

- Migration GSC déjà lancée (« en cours de migration »)
- `robots.txt` déployé sur le repo redirect
- Consolidation Google plus lente sur les URLs profondes

## Ne pas faire

- Supprimer les enregistrements MX / mail
- Laisser expirer le domaine `.me`
- Réimporter un CSV modifié sans comprendre l’impact (risque de couper mail ou GitHub)
