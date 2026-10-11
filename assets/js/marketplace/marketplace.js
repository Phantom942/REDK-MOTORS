/**
 * Marketplace RED-K MOTORS — charge Supabase uniquement si configuré.
 * Pas de données fictives : catalogue vide tant que enabled + clés absents.
 */

import { readMarketplaceConfig } from "./config.js";
import { getSupabase } from "./client.js";
import { mountAuthApp } from "./auth.js";
import { mountAccountApp } from "./account.js";
import { mountListingForm } from "./listing-form.js";
import { mountAdminApp } from "./admin.js";
import { ensureRootVisible, renderFatalError, renderInfo, renderLoading } from "./ui-shell.js";

function readConfig() {
  return readMarketplaceConfig();
}

function renderSetupMessage(root, message) {
  renderInfo(root, `<p>${message}</p>`);
}

function readCatalogFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    make: params.get("make")?.trim() || "",
    seller: params.get("seller") || "",
    minYear: params.get("minYear") ? Number(params.get("minYear")) : null,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : null,
  };
}

function buildCatalogQuery(supabase, filters) {
  let q = supabase.from("listings_public").select("*").order("published_at", { ascending: false }).limit(48);
  if (filters.make) q = q.ilike("make", `%${filters.make}%`);
  if (filters.seller === "private" || filters.seller === "consignment") q = q.eq("seller_type", filters.seller);
  if (filters.minYear && Number.isFinite(filters.minYear)) q = q.gte("model_year", filters.minYear);
  if (filters.maxPrice && Number.isFinite(filters.maxPrice)) q = q.lte("price_cents", Math.round(filters.maxPrice * 100));
  return q;
}

function renderCatalogFilters(config, filters) {
  return `
    <form class="mp-filters container" method="get" action="${config.paths.catalog}">
      <label>Marque<input name="make" value="${filters.make.replace(/"/g, "&quot;")}" placeholder="ex. Renault" /></label>
      <label>Année min<input name="minYear" type="number" min="1990" max="2030" value="${filters.minYear ?? ""}" /></label>
      <label>Prix max (€)<input name="maxPrice" type="number" min="500" step="500" value="${filters.maxPrice ?? ""}" /></label>
      <label>Vendeur
        <select name="seller">
          <option value="">Tous</option>
          <option value="private" ${filters.seller === "private" ? "selected" : ""}>Particulier</option>
          <option value="consignment" ${filters.seller === "consignment" ? "selected" : ""}>Dépôt-vente garage</option>
        </select>
      </label>
      <button type="submit" class="btn btn--secondary">Filtrer</button>
      <a class="mp-filters__reset" href="${config.paths.catalog}">Réinitialiser</a>
    </form>`;
}

async function initCatalog(root, config) {
  if (!config.enabled || !config.supabaseUrl || !config.supabaseAnonKey) {
    renderSetupMessage(
      root,
      "Le catalogue est en cours de déploiement. Revenez bientôt ou contactez le garage pour le dépôt-vente.",
    );
    return;
  }

  const supabase = getSupabase();
  const filters = readCatalogFilters();

  ensureRootVisible(root);
  root.innerHTML = `${renderCatalogFilters(config, filters)}<div class="mp-state mp-state--loading" role="status"><p>Chargement des annonces…</p></div>`;

  const { data, error } = await buildCatalogQuery(supabase, filters);

  if (error) {
    root.removeAttribute("aria-busy");
    root.innerHTML = `${renderCatalogFilters(config, filters)}<div class="mp-state mp-state--error" role="alert"><p>Impossible de charger le catalogue (${error.message ?? "erreur réseau"}).</p><button type="button" class="btn btn--secondary" data-mp-retry-catalog>Réessayer</button></div>`;
    root.querySelector("[data-mp-retry-catalog]")?.addEventListener("click", () => initCatalog(root, config));
    console.error(error);
    return;
  }
  root.removeAttribute("aria-busy");

  if (!data?.length) {
    root.innerHTML = `${renderCatalogFilters(config, filters)}<div class="mp-state mp-state--empty"><p>Aucune annonce ne correspond à vos critères.</p><p><a class="btn btn--primary" href="${config.paths.publish}">Déposer une annonce</a></p></div>`;
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

  root.innerHTML = `${renderCatalogFilters(config, filters)}<div class="container mp-grid" aria-live="polite">${cards}</div>`;
}

async function bootMarketplace() {
  const root = document.getElementById("marketplace-root");
  if (!root) return;

  const fallback = root.querySelector("[data-mp-fallback]");
  fallback?.remove();

  renderLoading(root);
  const app = root.dataset.mpApp || "catalog";

  try {
    if (app === "catalog") {
      await initCatalog(root, readConfig());
    } else if (app === "auth") {
      await mountAuthApp(root);
    } else if (app === "account") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode")) {
        await mountAuthApp(root);
      } else {
        await mountAccountApp(root);
      }
    } else if (app === "publish") {
      await mountListingForm(root);
    } else if (app === "admin") {
      await mountAdminApp(root);
    } else {
      renderSetupMessage(root, "Espace en cours d'activation.");
    }
  } catch (err) {
    console.error("[marketplace]", err);
    const msg =
      err?.message === "marketplace_not_configured"
        ? "Marketplace non configurée sur cette page."
        : "Une erreur empêche l’affichage de l’espace. Vérifiez votre connexion et réessayez.";
    renderFatalError(root, msg, "reload");
  }
}

function startBoot() {
  bootMarketplace().catch((err) => {
    console.error("[marketplace boot]", err);
    const root = document.getElementById("marketplace-root");
    if (root) renderFatalError(root, "Initialisation impossible.", "reload");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startBoot);
} else {
  startBoot();
}
