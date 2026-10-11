/**
 * HTML fiche véhicule (Worker Cloudflare + middleware Eleventy dev).
 * Retrait catalogue = 404 immédiat (données via RPC, pas de cache long).
 */

const SITE = {
  name: "RED-K MOTORS",
  url: "https://redkmotors.fr",
  phone: "06 48 74 56 68",
  phoneE164: "+33648745668",
  address: "9 rue Michelet, 94200 Ivry-sur-Seine",
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrice(cents) {
  return (Number(cents) / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function formatKm(km) {
  return Number(km).toLocaleString("fr-FR");
}

function fuelLabel(f) {
  const map = { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique", gpl: "GPL" };
  return map[f] ?? f;
}

export async function fetchPublicListingBySlug(supabaseUrl, anonKey, slug) {
  const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/get_public_listing_by_slug`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_slug: slug }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.listing) return null;
  return data;
}

/**
 * @param {object} opts
 * @param {object} opts.payload — { listing, photos }
 * @param {string} opts.supabaseUrl
 * @param {boolean} [opts.allowIndex=false] — noindex tant que lancement non autorisé
 */
export function renderListingPageHtml({ payload, supabaseUrl, allowIndex = false }) {
  const l = payload.listing;
  const photos = payload.photos ?? [];
  const path = `/achat-revente/vehicules/${encodeURIComponent(l.slug)}/`;
  const canonical = `${SITE.url}${path}`;
  const title = `${l.make} ${l.model} ${l.model_year} · ${formatPrice(l.price_cents)} | ${SITE.name}`;
  const descRaw = (l.description || `${l.make} ${l.model} ${l.model_year}, ${formatKm(l.mileage_km)} km, ${l.city}.`)
    .replace(/\s+/g, " ")
    .trim();
  const description = descRaw.length > 155 ? `${descRaw.slice(0, 152)}…` : descRaw;
  const robots = allowIndex ? "index, follow" : "noindex, follow";
  const isConsignment = l.seller_type === "consignment";
  const photoBase = `${supabaseUrl.replace(/\/$/, "")}/functions/v1/serve-listing-photo?photoId=`;

  const gallery =
    photos.length > 0
      ? `<div class="mp-detail__gallery">${photos
          .map(
            (p, i) =>
              `<figure class="mp-detail__photo"><img src="${esc(photoBase + encodeURIComponent(p.id))}" alt="${esc(
                `${l.make} ${l.model} — photo ${i + 1}`,
              )}" loading="${i === 0 ? "eager" : "lazy"}" width="800" height="600" /></figure>`,
          )
          .join("")}</div>`
      : `<p class="mp-detail__no-photo">Photos indisponibles.</p>`;

  let contactBlock;
  if (isConsignment) {
    contactBlock = `
      <div class="mp-detail__contact">
        <p class="mp-badge mp-badge--garage">Dépôt-vente ${esc(SITE.name)}</p>
        <p>Contact garage : <a href="tel:${esc(SITE.phoneE164)}">${esc(SITE.phone)}</a></p>
        <p class="mp-form__hint">${esc(SITE.address)}</p>
      </div>`;
  } else {
    const parts = [];
    if (l.contact_phone) parts.push(`<a class="btn btn--primary" href="tel:${esc(l.contact_phone.replace(/\s/g, ""))}">Appeler le vendeur</a>`);
    if (l.contact_whatsapp) {
      const wa = l.contact_whatsapp.replace(/\D/g, "");
      parts.push(`<a class="btn btn--secondary" href="https://wa.me/${esc(wa)}" rel="noopener noreferrer">WhatsApp</a>`);
    }
    if (l.contact_email) parts.push(`<a class="btn btn--secondary" href="mailto:${esc(l.contact_email)}">Email</a>`);
    contactBlock = `
      <div class="mp-detail__contact">
        <p class="mp-badge mp-badge--private">Annonce particulier — ${esc(SITE.name)} n'est pas vendeur</p>
        <div class="mp-detail__contact-actions">${parts.join(" ") || "<p>Coordonnées non renseignées.</p>"}</div>
      </div>`;
  }

  const ogImage =
    photos[0]?.id != null ? `${photoBase}${encodeURIComponent(photos[0].id)}` : `${SITE.url}/assets/img/og-default.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${l.make} ${l.model} ${l.model_year}`,
    brand: { "@type": "Brand", name: l.make },
    model: l.model,
    vehicleModelDate: String(l.model_year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: l.mileage_km,
      unitCode: "KMT",
    },
    fuelType: fuelLabel(l.fuel),
    vehicleTransmission: l.gearbox,
    offers: {
      "@type": "Offer",
      price: (l.price_cents / 100).toFixed(0),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: canonical,
    },
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="stylesheet" href="/assets/css/marketplace.css" />
  <link rel="stylesheet" href="/assets/css/main.css" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="mp-detail-body">
  <header class="site-header site-header--compact">
    <div class="container">
      <a href="/">${esc(SITE.name)}</a>
      <nav><a href="/achat-revente/vehicules/">Catalogue</a></nav>
    </div>
  </header>
  <main class="container mp-detail">
    <nav class="mp-detail__breadcrumb" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a> · <a href="/achat-revente/vehicules/">Véhicules</a> · <span>${esc(l.make)} ${esc(l.model)}</span>
    </nav>
    <h1>${esc(l.make)} ${esc(l.model)} ${l.model_year}${l.trim ? ` · ${esc(l.trim)}` : ""}</h1>
    <p class="mp-detail__price">${esc(formatPrice(l.price_cents))}</p>
    <p class="mp-detail__meta">${esc(formatKm(l.mileage_km))} km · ${esc(fuelLabel(l.fuel))} · ${esc(l.gearbox)} · ${esc(l.city)} (${esc(l.postal_code)})</p>
    ${gallery}
    <section class="mp-detail__desc">
      <h2>Description</h2>
      <p>${esc(l.description).replace(/\n/g, "<br />")}</p>
    </section>
    ${contactBlock}
  </main>
  <footer class="site-footer site-footer--compact">
    <div class="container"><p>© ${new Date().getFullYear()} ${esc(SITE.name)} — Ivry-sur-Seine (94)</p></div>
  </footer>
</body>
</html>`;
}

export function listingSlugFromPath(pathname) {
  const m = pathname.replace(/\/index\.html$/i, "/").match(/^\/achat-revente\/vehicules\/([^/]+)\/?$/);
  if (!m) return null;
  const slug = decodeURIComponent(m[1]);
  if (!slug || slug === "vehicules") return null;
  return slug;
}

export function createListingDevMiddleware(getEnv) {
  return async function marketplaceListingMiddleware(req, res, next) {
    const slug = listingSlugFromPath(req.url.split("?")[0]);
    if (!slug) return next();

    const { url, anonKey, allowIndex } = getEnv();
    if (!url || !anonKey) return next();

    try {
      const payload = await fetchPublicListingBySlug(url, anonKey, slug);
      if (!payload) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(`<!DOCTYPE html><html lang="fr"><head><meta name="robots" content="noindex,nofollow"><title>Annonce indisponible</title></head><body><p>Cette annonce n'est plus disponible.</p><p><a href="/achat-revente/vehicules/">Retour au catalogue</a></p></body></html>`);
        return;
      }
      const html = renderListingPageHtml({ payload, supabaseUrl: url, allowIndex });
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=60");
      res.end(html);
    } catch {
      next();
    }
  };
}
