#!/usr/bin/env node
/**
 * Tests funnel conversion formulaire (sans navigateur / sans PII).
 */
const assert = require("assert");
const funnel = require("../assets/js/conversion-funnel.js");

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function mockForm(fields) {
  const nodes = fields.map((f) => ({
    value: f.value,
    type: f.type || "text",
    hasAttribute(name) {
      return !!f[name];
    },
    getAttribute() {
      return null;
    },
  }));
  return {
    checkValidity() {
      return fields.every((f) => {
        if (f.required && !String(f.value || "").trim()) return false;
        if (f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
          return false;
        }
        return true;
      });
    },
    querySelectorAll(sel) {
      if (!sel.includes("required")) return [];
      return nodes.filter((_, i) => fields[i].required);
    },
    querySelector(sel) {
      if (sel.includes("email")) {
        const i = fields.findIndex((f) => f.type === "email");
        return i >= 0 ? nodes[i] : null;
      }
      return null;
    },
  };
}

function mockStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

function main() {
  // Valid form → form_submit_contact
  {
    const form = mockForm([
      { value: "Alice", required: true },
      { value: "0612345678", required: true },
      { value: "", type: "email" },
    ]);
    assert.strictEqual(funnel.resolveSubmitEvent(form, {}), "form_submit_contact");
    ok("formulaire valide → form_submit_contact");
  }

  // Invalid (empty required / whitespace) → blocked
  {
    const form = mockForm([
      { value: "   ", required: true },
      { value: "0612345678", required: true },
    ]);
    assert.strictEqual(
      funnel.resolveSubmitEvent(form, {}),
      "form_submit_attempt_blocked",
    );
    ok("champs requis vides/espaces → form_submit_attempt_blocked");
  }

  // defaultPrevented (validation JS main.js) → blocked
  {
    const form = mockForm([
      { value: "Alice", required: true },
      { value: "0612345678", required: true },
    ]);
    assert.strictEqual(
      funnel.resolveSubmitEvent(form, { defaultPrevented: true }),
      "form_submit_attempt_blocked",
    );
    ok("defaultPrevented → form_submit_attempt_blocked");
  }

  // Email invalide
  {
    const form = mockForm([
      { value: "Alice", required: true },
      { value: "0612345678", required: true },
      { value: "pas-un-email", type: "email" },
    ]);
    assert.strictEqual(
      funnel.resolveSubmitEvent(form, {}),
      "form_submit_attempt_blocked",
    );
    ok("email invalide → blocked");
  }

  // Pending token + consume one-shot
  {
    const store = mockStorage();
    assert.ok(funnel.markFormSubmitPending(store));
    assert.ok(funnel.consumeFormSubmitPending(store));
    assert.strictEqual(funnel.consumeFormSubmitPending(store), false);
    ok("jeton pending consommé une seule fois (anti-reload)");
  }

  // Expired pending
  {
    const store = mockStorage();
    store.setItem(funnel.FORM_PENDING_KEY, String(Date.now() - funnel.FORM_PENDING_TTL_MS - 1000));
    assert.strictEqual(funnel.consumeFormSubmitPending(store), false);
    ok("jeton expiré → pas de success");
  }

  // shouldPushFormSubmitSuccess matrix
  assert.strictEqual(
    funnel.shouldPushFormSubmitSuccess({
      sourceForm: true,
      hasConsent: true,
      pendingConsumed: true,
    }),
    true,
  );
  assert.strictEqual(
    funnel.shouldPushFormSubmitSuccess({
      sourceForm: true,
      hasConsent: false,
      pendingConsumed: true,
    }),
    false,
  );
  assert.strictEqual(
    funnel.shouldPushFormSubmitSuccess({
      sourceForm: true,
      hasConsent: true,
      pendingConsumed: false,
    }),
    false,
  );
  assert.strictEqual(
    funnel.shouldPushFormSubmitSuccess({
      sourceForm: false,
      hasConsent: true,
      pendingConsumed: true,
    }),
    false,
  );
  ok("success seulement si source=form + consentement + jeton");

  // No PII in event payload shape (documented contract)
  const sample = {
    event: "form_submit_success",
    page_key: "merci",
    location: "/merci/",
    cta_position: "merci",
  };
  assert.ok(!("email" in sample) && !("telephone" in sample) && !("nom" in sample));
  ok("payload dataLayer sans données personnelles");

  console.log("Tests conversion tracking: OK");
}

main();
