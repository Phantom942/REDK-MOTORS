/**
 * Helpers funnel formulaire (sans PII) — partagés track.js / tests Node.
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

  /**
   * Décide quel event formulaire pousser au submit.
   * @returns {'form_submit_contact'|'form_submit_attempt_blocked'|null}
   */
  function resolveSubmitEvent(form, submitEvent) {
    if (!form) return null;
    if (submitEvent && submitEvent.defaultPrevented) return "form_submit_attempt_blocked";
    if (!formPassesCustomValidation(form)) return "form_submit_attempt_blocked";
    return "form_submit_contact";
  }

  /**
   * Merci page : faut-il pousser form_submit_success ?
   */
  function shouldPushFormSubmitSuccess(opts) {
    var sourceForm = opts && opts.sourceForm;
    var hasConsent = opts && opts.hasConsent;
    var pendingConsumed = opts && opts.pendingConsumed;
    if (!sourceForm) return false;
    if (!hasConsent) return false;
    if (!pendingConsumed) return false;
    return true;
  }

  return {
    FORM_PENDING_KEY: FORM_PENDING_KEY,
    FORM_PENDING_TTL_MS: FORM_PENDING_TTL_MS,
    formPassesCustomValidation: formPassesCustomValidation,
    markFormSubmitPending: markFormSubmitPending,
    consumeFormSubmitPending: consumeFormSubmitPending,
    resolveSubmitEvent: resolveSubmitEvent,
    shouldPushFormSubmitSuccess: shouldPushFormSubmitSuccess,
  };
});
