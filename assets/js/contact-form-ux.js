/**
 * UX formulaires contact / Pro — indépendante du consentement Analytics.
 * Ne pousse aucun event GTM/GA4. Gère pending session + états bouton.
 */
(function () {
  "use strict";

  if (window.__REDK_FORM_UX_BOUND__) return;
  window.__REDK_FORM_UX_BOUND__ = true;

  var RESTORE_MS = 15000;

  function funnel() {
    return window.REDKMotorsConversionFunnel || null;
  }

  function setSubmitting(form, on) {
    if (!form) return;
    var btn = form.querySelector("[data-contact-submit]");
    var status = form.querySelector("[data-contact-status]");
    if (btn) {
      if (!btn.dataset.originalLabel) {
        btn.dataset.originalLabel = (btn.textContent || "").trim();
      }
      if (on) {
        btn.disabled = true;
        btn.setAttribute("aria-busy", "true");
        btn.textContent = "Envoi en cours…";
      } else {
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
        btn.textContent =
          btn.dataset.originalLabel || "Envoyer ma demande";
      }
    }
    if (status) {
      if (on) {
        status.hidden = false;
        status.textContent =
          "Envoi vers notre messagerie… La page suivante confirme l’initiation, pas la livraison de l’e-mail.";
      } else {
        status.hidden = true;
        status.textContent = "";
      }
    }
  }

  function restoreAll() {
    document.querySelectorAll("form[data-contact-form]").forEach(function (form) {
      form.__redkSubmitting = false;
      setSubmitting(form, false);
      if (form.__redkRestoreTimer) {
        clearTimeout(form.__redkRestoreTimer);
        form.__redkRestoreTimer = null;
      }
    });
  }

  function onSubmit(e) {
    var form = e.target;
    if (!form || !form.hasAttribute || !form.hasAttribute("data-contact-form")) {
      return;
    }
    var api = funnel();
    if (!api) return;

    var resolved = api.resolveSubmitEvent(form, e);
    if (resolved !== "form_submit_contact") {
      setSubmitting(form, false);
      form.__redkSubmitting = false;
      return;
    }

    // Anti double-clic : ignorer un second submit tant que le premier est en cours
    if (form.__redkSubmitting) {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      return;
    }
    form.__redkSubmitting = true;

    api.markFormSubmitPending();
    setSubmitting(form, true);

    if (form.__redkRestoreTimer) clearTimeout(form.__redkRestoreTimer);
    form.__redkRestoreTimer = setTimeout(function () {
      // Échec réseau, annulation, ou navigation bloquée : ne pas laisser le bouton mort
      setSubmitting(form, false);
      form.__redkRestoreTimer = null;
    }, RESTORE_MS);
  }

  document.addEventListener("submit", onSubmit, true);

  // Retour arrière / bfcache : rétablir l’UI
  window.addEventListener("pageshow", function () {
    restoreAll();
  });
  window.addEventListener("pagehide", function () {
    restoreAll();
  });

  window.REDKMotorsContactFormUx = {
    setSubmitting: setSubmitting,
    restoreAll: restoreAll,
  };
})();
