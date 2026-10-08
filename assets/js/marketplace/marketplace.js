/**
 * Marketplace RED-K MOTORS — charge Supabase uniquement si configuré.
 * Pas de données fictives : catalogue vide tant que enabled + clés absents.
 */

import { readMarketplaceConfig } from "./config.js";
import { mountAuthApp } from "./auth.js";
import { mountAccountApp } from "./account.js";
import { mountListingForm } from "./listing-form.js";
import { mountAdminApp } from "./admin.js";

function readConfig() {
  return readMarketplaceConfig();
}

function renderSetupMessage(root, message) {
  root.hidden = false;
  root.innerHTML = `<div class="mp-state mp-state--info" role="status"><p>${message}</p></div>`;
}

async function initCatalog(root, config) {
  if (!config.enabled || !config.supabaseUrl || !config.supabaseAnonKey) {
    renderSetupMessage(
      root,
      "Le catalogue est en cours de déploiement. Revenez bientôt ou contactez le garage pour le dépôt-vente.",
    );
    return;
  }

  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.1");
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

  root.hidden = false;
  root.innerHTML = `<div class="mp-state" role="status"><p>Chargement des annonces…</p></div>`;

  const { data, error } = await supabase.from("listings_public").select("*").order("published_at", { ascending: false }).limit(24);

  if (error) {
    renderSetupMessage(root, "Impossible de charger le catalogue pour le moment.");
    console.error(error);
    return;
  }

  if (!data?.length) {
    root.innerHTML = `<div class="mp-state mp-state--empty"><p>Aucune annonce publiée pour le moment.</p><p><a class="btn btn--primary" href="${config.paths.publish}">Déposer la première annonce</a></p></div>`;
    return;
  }

  const cards = data
    .map((row) => {
      const price = (row.price_cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
      const badge =
        row.seller_type === "consignment"
          ? `<span class="mp-badge mp-badge--garage">Dépôt-vente Red-K Motors</span>`
          : `<span class="mp-badge mp-badge--private">Particulier</span>`;
      const href = `${config.paths.listingPrefix}${encodeURIComponent(row.slug || row.id)}/`;
      return `<article class="mp-card"><a href="${href}"><h2 class="mp-card__title">${row.make} ${row.model} ${row.model_year}</h2><p class="mp-card__meta">${row.mileage_km.toLocaleString("fr-FR")} km · ${row.city}</p><p class="mp-card__price">${price}</p>${badge}</a></article>`;
    })
    .join("");

  root.innerHTML = `<div class="container mp-grid" aria-live="polite">${cards}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("marketplace-root");
  if (!root) return;
  const app = root.dataset.mpApp || "catalog";
  if (app === "catalog") {
    initCatalog(root, readConfig());
  } else if (app === "auth") {
    mountAuthApp(root);
  } else if (app === "account") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode")) {
      mountAuthApp(root);
    } else {
      mountAccountApp(root);
    }
  } else if (app === "publish") {
    mountListingForm(root);
  } else if (app === "admin") {
    mountAdminApp(root);
  } else {
    renderSetupMessage(root, "Espace en cours d'activation.");
  }
});
