# RED-K MOTORS

Garage automobile à Ivry-sur-Seine (mécanique, carrosserie, entretien, pneumatiques, location).

- **Contact** : 06 48 74 56 68 | contact@redkmotors.fr
- **Site** : redkmotors.fr
- **Hébergement** : GitHub Pages (workflow `.github/workflows/deploy.yml`)
- **Snapchat** : RedkMotors

## Développement

```bash
npm ci
npm run build          # génère _site/
npm run audit:code     # qualité + SEO blog/prestations/keywords
npm run audit:sitemap  # après build
npm run audit:links    # liens internes cassés (après build)
npm run ops:check      # prod IndexNow + GEO
```

Checklist **hors code** (GSC, GTM, Cloudflare KV) : [docs/checklist-proprietaire-seo-ops.md](docs/checklist-proprietaire-seo-ops.md)

