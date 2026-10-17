/**
 * Helpers funnel formulaire (sans PII) — partagés track.js / tests Node.
 *
 * Events :
 * - form_submit_attempt_blocked — validation échouée
 * - form_submit_contact — submit client valide (POST FormSubmit démarré)
 * - form_submit_redirect — page /merci/?source=form affichée (redirection _next)
 * - form_submit_success — jeton session présent : funnel client confirmé
 *   (meilleur proxy « FormSubmit a accepté le POST » ; ≠ e-mail livré)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.REDKMotorsConversionFunnel = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var FORM_PENDING_KEY = "redk_form_submit_pending";
  var FORM_PENDING_TTL_MS = 30 * 60 * 1000;
  var REDIRECT_FIRED_KEY = "redk_merci_redirect_fired";

  function formPassesCustomValidation(form) {
    if (!form) return false;
    if (typeof form.checkValidity === "function" && !form.checkValidity()) return false;
    var required = form.querySelectorAll(
      "input[required], select[required], textarea[required]",
    );
    for (var i = 0; i < required.length; i++) {
      if (!String(required[i].value || "").trim()) return false;
    }
    var email = form.querySelector('input[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      return false;
    }
    return true;
  }

  function markFormSubmitPending(storage) {
    var store = storage || (typeof sessionStorage !== "undefined" ? sessionStorage : null);
    if (!store) return false;
    try {
      store.setItem(FORM_PENDING_KEY, String(Date.now()));
      // Nouveau submit → autoriser un nouvel event redirect sur /merci/
      store.removeItem(REDIRECT_FIRED_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  function peekFormSubmitPending(storage, now) {
    var store = storage || (typeof sessionStorage !== "undefined" ? sessionStorage : null);
    if (!store) return false;
    try {
      var raw = store.getItem(FORM_PENDING_KEY);
      if (!raw) return false;
      var ts = parseInt(raw, 10);
      var t = typeof now === "number" ? now : Date.now();
      if (!ts || t - ts > FORM_PENDING_TTL_MS) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function consumeFormSubmitPending(storage, now) {
    var store = storage || (typeof sessionStorage !== "undefined" ? sessionStorage : null);
    if (!store) return false;
    try {
      var raw = store.getItem(FORM_PENDING_KEY);
      if (!raw) return false;
      var ts = parseInt(raw, 10);
      store.removeItem(FORM_PENDING_KEY);
      var t = typeof now === "number" ? now : Date.now();
      if (!ts || t - ts > FORM_PENDING_TTL_MS) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function shouldFireRedirectEvent(storage) {
    var store = storage || (typeof sessionStorage !== "undefined" ? sessionStorage : null);
    if (!store) return false;
    try {
      if (store.getItem(REDIRECT_FIRED_KEY) === "1") return false;
      store.setItem(REDIRECT_FIRED_KEY, "1");
      return true;
    } catch (e) {
      return false;
    }
  }

  function resolveSubmitEvent(form, submitEvent) {
    if (!form) return null;
    if (submitEvent && submitEvent.defaultPrevented) return "form_submit_attempt_blocked";
    if (!formPassesCustomValidation(form)) return "form_submit_attempt_blocked";
    return "form_submit_contact";
  }

  /**
   * Décide les events merci (sans PII).
   * @returns {{ redirect: boolean, success: boolean, unverifiedLanding: boolean }}
   */
  function resolveMerciEvents(opts) {
    var sourceForm = !!(opts && opts.sourceForm);
    var hasConsent = !!(opts && opts.hasConsent);
    var hadPending = !!(opts && opts.hadPending);
    var allowRedirectSlot = !!(opts && opts.allowRedirectSlot);

    var out = { redirect: false, success: false, unverifiedLanding: false };
    if (!sourceForm || !hasConsent) return out;

    if (hadPending) {
      // Redirection _next après submit client valide (proxy « POST FormSubmit accepté »)
      if (allowRedirectSlot) out.redirect = true;
      out.success = true;
    } else if (allowRedirectSlot) {
      // /merci/?source=form sans jeton : landing non vérifiée (URL manuelle / session perdue)
      out.unverifiedLanding = true;
    }
    return out;
  }

  function shouldPushFormSubmitSuccess(opts) {
    return resolveMerciEvents({
      sourceForm: opts && opts.sourceForm,
      hasConsent: opts && opts.hasConsent,
      hadPending: opts && opts.pendingConsumed,
      allowRedirectSlot: true,
    }).success;
  }

  return {
    FORM_PENDING_KEY: FORM_PENDING_KEY,
    FORM_PENDING_TTL_MS: FORM_PENDING_TTL_MS,
    REDIRECT_FIRED_KEY: REDIRECT_FIRED_KEY,
    formPassesCustomValidation: formPassesCustomValidation,
    markFormSubmitPending: markFormSubmitPending,
    peekFormSubmitPending: peekFormSubmitPending,
    consumeFormSubmitPending: consumeFormSubmitPending,
    shouldFireRedirectEvent: shouldFireRedirectEvent,
    resolveSubmitEvent: resolveSubmitEvent,
    resolveMerciEvents: resolveMerciEvents,
    shouldPushFormSubmitSuccess: shouldPushFormSubmitSuccess,
  };
});
