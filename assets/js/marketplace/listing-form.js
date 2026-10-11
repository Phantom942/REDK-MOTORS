import { getSupabase, isConfigured } from "./client.js";
import { readMarketplaceConfig } from "./config.js";
import {
  deleteListingPhoto,
  loadListingPhotos,
  MAX_PHOTOS,
  MIN_PHOTOS,
  reorderListingPhotos,
  signedPhotoUrl,
  uploadListingPhoto,
} from "./photos.js";
import { ensureRootVisible } from "./ui-shell.js";
import { getValidSession, redirectToLogin, runWithNetwork } from "./session.js";

const FUELS = ["essence", "diesel", "hybride", "hybride_rechargeable", "electrique", "gpl", "autre"];
const GEARBOX = ["manuelle", "automatique", "robotisee"];

function listingFields(fd, email) {
  return {
    make: String(fd.get("make")).trim(),
    model: String(fd.get("model")).trim(),
    trim: String(fd.get("trim") || "").trim() || null,
    model_year: Number(fd.get("model_year")),
    mileage_km: Number(fd.get("mileage_km")),
    fuel: fd.get("fuel"),
    gearbox: fd.get("gearbox"),
    price_cents: Math.round(Number(fd.get("price_eur")) * 100),
    city: String(fd.get("city")).trim(),
    postal_code: String(fd.get("postal_code")).trim(),
    description: String(fd.get("description")).trim(),
    contact_phone: String(fd.get("contact_phone")).trim(),
    contact_whatsapp: String(fd.get("contact_whatsapp") || "").trim() || null,
    show_email: Boolean(fd.get("show_email")),
    contact_email: fd.get("show_email") ? email : null,
  };
}

function listingInsertPayload(fd, uid, email) {
  return {
    owner_id: uid,
    seller_type: "private",
    status: "draft",
    ...listingFields(fd, email),
  };
}

async function renderPhotoGrid(container, listingId, version, editable) {
  const photos = await loadListingPhotos(listingId, version);
  const items = await Promise.all(
    photos.map(async (p) => {
      const url = await signedPhotoUrl(p.storage_path);
      return { ...p, url };
    }),
  );
  container.innerHTML = `
    <div class="mp-photos">
      ${items
        .map(
          (p, idx) => `<figure class="mp-photo" data-photo-id="${p.id}">
            <img src="${p.url}" alt="Photo ${idx + 1}" loading="lazy" />
            ${
              editable
                ? `<div class="mp-photo__tools">
              <button type="button" class="mp-photo__move" data-dir="up" data-id="${p.id}" ${idx === 0 ? "disabled" : ""} aria-label="Monter">↑</button>
              <button type="button" class="mp-photo__move" data-dir="down" data-id="${p.id}" ${idx === items.length - 1 ? "disabled" : ""} aria-label="Descendre">↓</button>
              <button type="button" class="mp-photo__del" data-id="${p.id}">Retirer</button>
            </div>`
                : ""
            }
          </figure>`,
        )
        .join("")}
    </div>
    <p class="mp-form__hint">${photos.length} / ${MAX_PHOTOS} photos (minimum ${MIN_PHOTOS} pour soumettre). La première photo est la couverture.</p>`;

  if (editable) {
    container.querySelectorAll(".mp-photo__del").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const path = await deleteListingPhoto(btn.dataset.id);
        const supabase = getSupabase();
        if (path) await supabase.storage.from("listing-photos-private").remove([path]);
        await renderPhotoGrid(container, listingId, version, editable);
      });
    });
    container.querySelectorAll(".mp-photo__move").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const dir = btn.dataset.dir;
        const ids = items.map((x) => x.id);
        const i = ids.indexOf(btn.dataset.id);
        if (i < 0) return;
        const j = dir === "up" ? i - 1 : i + 1;
        if (j < 0 || j >= ids.length) return;
        [ids[i], ids[j]] = [ids[j], ids[i]];
        await reorderListingPhotos(listingId, ids);
        await renderPhotoGrid(container, listingId, version, editable);
      });
    });
  }
}

function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function renderListingPreview(root, listing, session, version) {
  ensureRootVisible(root);
  const photoGrid = document.createElement("div");
  await renderPhotoGrid(photoGrid, listing.id, version, false);
  const price = (listing.price_cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  root.innerHTML = `
    <div class="container mp-preview">
      <p class="mp-form__hint">Prévisualisation — rendu proche de la fiche publiée (sans URL publique tant que non validée).</p>
      <h2>${escHtml(listing.make)} ${escHtml(listing.model)} ${listing.model_year}</h2>
      <p class="mp-detail__price">${escHtml(price)}</p>
      <p>${listing.mileage_km.toLocaleString("fr-FR")} km · ${escHtml(listing.city)}</p>
      <div class="mp-form__full">${photoGrid.innerHTML}</div>
      <section><h3>Description</h3><p>${escHtml(listing.description).replace(/\n/g, "<br />")}</p></section>
      <p class="mp-badge mp-badge--private">Contact affiché : ${escHtml(listing.contact_phone)}${listing.show_email ? ` · ${escHtml(session.user.email)}` : ""}</p>
      <p class="mp-form__actions">
        <a class="btn btn--secondary" href="?id=${listing.id}">Retour à l’édition</a>
        <a class="btn btn--primary" href="${readMarketplaceConfig().paths.account}">Voir mes annonces</a>
      </p>
    </div>`;
}

export async function mountListingForm(root) {
  if (!isConfigured()) {
    root.hidden = false;
    root.innerHTML = `<div class="mp-alert mp-alert--info" role="status">Dépôt d'annonce bientôt disponible.</div>`;
    return;
  }

  const supabase = getSupabase();
  const { session, reason } = await getValidSession(supabase);
  if (!session) {
    redirectToLogin(reason);
    return;
  }

  const uid = session.user.id;
  const params = new URLSearchParams(window.location.search);
  const listingIdParam = params.get("id");
  const preview = params.get("preview") === "1";

  let listing = null;
  if (listingIdParam) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingIdParam)
      .eq("owner_id", uid)
      .maybeSingle();
    if (error || !data) {
      root.hidden = false;
      root.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Annonce introuvable.</div>`;
      return;
    }
    if (!["draft", "rejected"].includes(data.status)) {
      root.hidden = false;
      root.innerHTML = `<div class="mp-alert mp-alert--info" role="status">Cette annonce n'est plus modifiable ici (statut : ${data.status}).</div>`;
      return;
    }
    listing = data;
  }

  if (preview) {
    if (!listing) {
      ensureRootVisible(root);
      root.innerHTML = `<div class="mp-alert mp-alert--info" role="status">Enregistrez d’abord un brouillon pour prévisualiser.</div>`;
      return;
    }
    await renderListingPreview(root, listing, session, listing.current_version ?? 1);
    return;
  }

  ensureRootVisible(root);
  const l = listing;
  root.innerHTML = `
    <div class="container">
      <form id="mp-listing-form" class="mp-form mp-form--listing">
        <h2>${l ? "Modifier le brouillon" : "Déposer une annonce (particulier)"}</h2>
        <p class="mp-form__hint">Contact affiché : votre téléphone. Email affiché uniquement si vous cochez la case.</p>
        <div class="mp-form__grid">
          <label>Marque<input name="make" required maxlength="60" value="${l?.make ?? ""}" /></label>
          <label>Modèle<input name="model" required maxlength="80" value="${l?.model ?? ""}" /></label>
          <label>Finition<input name="trim" maxlength="80" value="${l?.trim ?? ""}" /></label>
          <label>Année<input name="model_year" type="number" min="1980" max="2030" required value="${l?.model_year ?? ""}" /></label>
          <label>Kilométrage<input name="mileage_km" type="number" min="0" required value="${l?.mileage_km ?? ""}" /></label>
          <label>Prix (€)<input name="price_eur" type="number" min="1" required value="${l ? l.price_cents / 100 : ""}" /></label>
          <label>Carburant<select name="fuel" required>${FUELS.map((f) => `<option value="${f}" ${l?.fuel === f ? "selected" : ""}>${f}</option>`).join("")}</select></label>
          <label>Boîte<select name="gearbox" required>${GEARBOX.map((g) => `<option value="${g}" ${l?.gearbox === g ? "selected" : ""}>${g}</option>`).join("")}</select></label>
          <label>Ville<input name="city" required value="${l?.city ?? ""}" /></label>
          <label>Code postal<input name="postal_code" pattern="[0-9]{5}" required value="${l?.postal_code ?? ""}" /></label>
          <label>Téléphone contact<input name="contact_phone" type="tel" required value="${l?.contact_phone ?? ""}" /></label>
          <label>WhatsApp<input name="contact_whatsapp" type="tel" value="${l?.contact_whatsapp ?? ""}" /></label>
          <label class="mp-form__full"><input type="checkbox" name="show_email" ${l?.show_email ? "checked" : ""} /> Afficher mon email (${session.user.email})</label>
        </div>
        <label class="mp-form__full">Description<textarea name="description" minlength="40" maxlength="8000" required rows="6">${l?.description ?? ""}</textarea></label>
        <div id="mp-photo-upload" class="mp-form__full">
          <label>Ajouter des photos (JPEG/PNG, max 8 Mo)<input type="file" accept="image/jpeg,image/png,image/webp" multiple /></label>
        </div>
        <div id="mp-photo-grid" class="mp-form__full"></div>
        <div class="mp-form__actions">
          <button type="submit" name="intent" value="draft" class="btn btn--secondary btn--dark">Enregistrer brouillon</button>
          <button type="button" class="btn btn--secondary" id="mp-preview-btn">Prévisualiser</button>
          <button type="submit" name="intent" value="submit" class="btn btn--primary">Soumettre à la modération</button>
        </div>
      </form>
      <div id="mp-listing-feedback"></div>
    </div>`;

  const form = root.querySelector("#mp-listing-form");
  const feedback = root.querySelector("#mp-listing-feedback");
  const photoGrid = root.querySelector("#mp-photo-grid");
  let currentListingId = l?.id;
  let currentVersion = l?.current_version ?? 1;

  async function ensureListingId(fd) {
    if (currentListingId) {
      const { error } = await supabase
        .from("listings")
        .update(listingFields(fd, session.user.email))
        .eq("id", currentListingId)
        .eq("owner_id", uid);
      if (error) throw error;
      return currentListingId;
    }
    const { data, error } = await supabase
      .from("listings")
      .insert(listingInsertPayload(fd, uid, session.user.email))
      .select("id, current_version")
      .single();
    if (error) throw error;
    currentListingId = data.id;
    currentVersion = data.current_version;
    history.replaceState(null, "", `?id=${currentListingId}`);
    return currentListingId;
  }

  if (currentListingId) {
    await renderPhotoGrid(photoGrid, currentListingId, currentVersion, true);
  }

  root.querySelector("#mp-photo-upload input").addEventListener("change", async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    const fd = new FormData(form);
    try {
      const id = await ensureListingId(fd);
      const existing = await loadListingPhotos(id, currentVersion);
      let order = existing.length;
      for (const file of files) {
        if (order >= MAX_PHOTOS) break;
        await uploadListingPhoto(id, file, order);
        order += 1;
      }
      await renderPhotoGrid(photoGrid, id, currentVersion, true);
    } catch (err) {
      feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Photo refusée (${err.message ?? "erreur"}).</div>`;
    }
    e.target.value = "";
  });

  root.querySelector("#mp-preview-btn")?.addEventListener("click", async () => {
    const fd = new FormData(form);
    try {
      const id = await ensureListingId(fd);
      window.location.href = `?id=${id}&preview=1`;
    } catch (err) {
      feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Enregistrez le brouillon avant prévisualisation (${err.message ?? "erreur"}).</div>`;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const intent = e.submitter?.value === "submit" ? "submit" : "draft";

    const saved = await runWithNetwork(feedback, async () => {
      const id = await ensureListingId(fd);
      if (intent === "submit") {
        const photos = await loadListingPhotos(id, currentVersion);
        if (photos.length < MIN_PHOTOS) {
          return { error: "min_photos" };
        }
        const { error: submitErr } = await supabase.rpc("submit_listing_for_review", { p_listing_id: id });
        if (submitErr) return { error: submitErr.message };
        return { ok: "submitted" };
      }
      return { ok: "draft" };
    });

    if (saved?.error === "network") return;
    if (saved?.error === "min_photos") {
      feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Ajoutez au moins ${MIN_PHOTOS} photos avant soumission.</div>`;
      return;
    }
    if (saved?.error) {
      feedback.innerHTML = `<div class="mp-alert mp-alert--error" role="alert">Opération impossible : ${saved.error}</div>`;
      return;
    }
    if (saved?.ok === "submitted") {
      feedback.innerHTML = `<div class="mp-alert mp-alert--success" role="status">Annonce soumise. Validation par un modérateur avant publication.</div>`;
    } else {
      feedback.innerHTML = `<div class="mp-alert mp-alert--success" role="status">Brouillon enregistré.</div>`;
    }
  });
}
