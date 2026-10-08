# Cycle de vie des photos

| Phase | Stockage | Accès |
|-------|----------|--------|
| Brouillon / refusé / en attente | Bucket **privé** uniquement | Propriétaire + modérateurs (URLs signées courtes) |
| Publié | **Même bucket privé** | Edge `serve-listing-photo` si annonce `published` + version approuvée |

## Traitement obligatoire (serveur)

- Upload **uniquement** via Edge Function `process-listing-photo` (pas d'upload Storage direct client).
- Magic bytes, décodage, limites pixels/dimensions/poids, réencodage WebP **sans métadonnées**.
- Ligne `listing_photos` avec `server_verified = true` et `verified_at` (RPC `register_verified_listing_photo`, service role).
- Soumission refusée si photo non vérifiée ou fichier absent du bucket.

## Publication (atomique côté métier)

1. Modération vérifie présence des fichiers privés + version `pending_review`.
2. `apply_listing_approval` met l'annonce en `published` et `published_version` sur les photos.
3. **Aucune copie** vers un bucket public avant approbation — pas de fenêtre d'exposition.

## Retrait / suspension / edit après publish

- `published_version` remis à `null` en base → `serve-listing-photo` répond **404**.
- **Cache** : `Cache-Control: public, max-age=60` sur les images servies — retrait effectif sous ~60 s (purge CDN manuelle si urgence).
- Objets privés conservés pour historique modération ; job de nettoyage des brouillons abandonnés à planifier.

## Buckets legacy `listing-photos-public`

Non utilisés pour les nouvelles publications. Ne pas s'y fier pour la confidentialité.
