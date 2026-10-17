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
  {
    const form = mockForm([
      { value: "Alice", required: true },
      { value: "0612345678", required: true },
      { value: "", type: "email" },
    ]);
    assert.strictEqual(funnel.resolveSubmitEvent(form, {}), "form_submit_contact");
    ok("formulaire valide → form_submit_contact");
  }

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

  {
    const store = mockStorage();
    assert.ok(funnel.markFormSubmitPending(store));
    assert.ok(funnel.peekFormSubmitPending(store));
    assert.ok(funnel.consumeFormSubmitPending(store));
    assert.strictEqual(funnel.consumeFormSubmitPending(store), false);
    ok("jeton pending peek + consume one-shot");
  }

  {
    const store = mockStorage();
    funnel.markFormSubmitPending(store);
    assert.ok(funnel.shouldFireRedirectEvent(store));
    assert.strictEqual(funnel.shouldFireRedirectEvent(store), false);
    funnel.markFormSubmitPending(store);
    assert.ok(funnel.shouldFireRedirectEvent(store));
    ok("redirect slot one-shot, réarmé par nouveau pending");
  }

  {
    const verified = funnel.resolveMerciEvents({
      sourceForm: true,
      hasConsent: true,
      hadPending: true,
      allowRedirectSlot: true,
    });
    assert.deepStrictEqual(verified, {
      redirect: true,
      success: true,
      unverifiedLanding: false,
    });
    ok("merci vérifié → redirect + success");
  }

  {
    const unverified = funnel.resolveMerciEvents({
      sourceForm: true,
      hasConsent: true,
      hadPending: false,
      allowRedirectSlot: true,
    });
    assert.deepStrictEqual(unverified, {
      redirect: false,
      success: false,
      unverifiedLanding: true,
    });
    ok("merci sans jeton → redirect_unverified seulement");
  }

  {
    const noConsent = funnel.resolveMerciEvents({
      sourceForm: true,
      hasConsent: false,
      hadPending: true,
      allowRedirectSlot: true,
    });
    assert.deepStrictEqual(noConsent, {
      redirect: false,
      success: false,
      unverifiedLanding: false,
    });
    ok("sans consentement → aucun event merci");
  }

  assert.ok(
    funnel.shouldPushFormSubmitSuccess({
      sourceForm: true,
      hasConsent: true,
      pendingConsumed: true,
    }),
  );
  assert.ok(
    !funnel.shouldPushFormSubmitSuccess({
      sourceForm: true,
      hasConsent: true,
      pendingConsumed: false,
    }),
  );
  ok("shouldPushFormSubmitSuccess aligné sur success");

  console.log("Tests conversion tracking: OK");
}

main();
