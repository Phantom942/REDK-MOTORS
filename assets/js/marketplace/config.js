export function readMarketplaceConfig() {
  const el = document.getElementById("marketplace-config");
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

export const CONSENT_VERSION = "2026-04-08-v1";

export const CONSENT_TEXT = {
  email_marketing:
    "J'accepte de recevoir des offres commerciales par email de RED-K MOTORS (facultatif, révocable).",
  sms_marketing:
    "J'accepte de recevoir des offres commerciales par SMS de RED-K MOTORS (facultatif, révocable).",
  whatsapp_marketing:
    "J'accepte de recevoir des offres commerciales par WhatsApp de RED-K MOTORS (facultatif, révocable).",
};
