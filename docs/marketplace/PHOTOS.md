# Cycle de vie des photos

| Phase | Bucket | Accès |
|-------|--------|--------|
| Brouillon / en attente / refusé | `listing-photos-private` | Propriétaire + modérateurs (RLS storage) |
| Publié | Copie dans `listing-photos-public` | Lecture publique (URL CDN) |

## Règles

- Le vendeur **upload uniquement** dans le bucket privé (`/{user_id}/{listing_id}/...`).
- À l’**approbation** modération, une Edge Function copie vers le bucket public avec un **nouveau chemin** (pas de réutilisation d’URL d’une version précédente).
- **Modification** après publication : `begin_edit_published_listing` retire l’annonce du catalogue et **annule les chemins publics en base** ; appeler l’edge `purge-public-photos` (secret interne) pour supprimer les objets du bucket public.
- **Approbation** : `publish-listing-photos` (secret interne) copie vers le public **avant** `apply_listing_approval`. Échec copie = pas de publication.
- **Cache CDN** : après retrait, prévoir purge Cloudflare si TTL long ; les URLs `{listing_id}/{version}/{photo_id}.webp` ne sont plus référencées une fois retirées de `listing_public_photos`.
- **Suppression** compte / annonce : job de nettoyage des objets storage orphelins (privé + public).

## Métadonnées

Le traitement EXIF/GPS est fait côté Edge Function `process-listing-photo` (à déployer) avant stockage définitif.
