import { CONSENT_TEXT, CONSENT_VERSION } from "./config.js";

export const CHANNELS = ["email_marketing", "sms_marketing", "whatsapp_marketing"];

/** Métadonnées Auth — interprétées côté serveur à la création du compte uniquement. */
export function marketingConsentsFromForm(fd) {
  return {
    email_marketing: Boolean(fd.get("consent_email")),
    sms_marketing: Boolean(fd.get("consent_sms")),
    whatsapp_marketing: Boolean(fd.get("consent_whatsapp")),
  };
}

export function signupMetadataFromForm(fd) {
  return {
    first_name: fd.get("first_name"),
    last_name: fd.get("last_name"),
    phone: fd.get("phone"),
    city: fd.get("city"),
    postal_code: fd.get("postal_code"),
    marketing_consents: marketingConsentsFromForm(fd),
    consent_text_version: CONSENT_VERSION,
  };
}

export function consentPayload(userId, channel, granted) {
  return {
    user_id: userId,
    channel,
    granted: Boolean(granted),
    consent_text_version: CONSENT_VERSION,
    consent_text_snapshot: CONSENT_TEXT[channel],
  };
}

export function latestConsentsByChannel(rows) {
  const map = {};
  for (const row of rows ?? []) {
    if (!map[row.channel] || new Date(row.recorded_at) > new Date(map[row.channel].recorded_at)) {
      map[row.channel] = row;
    }
  }
  return map;
}

export async function loadConsentState(supabase, userId) {
  const { data, error } = await supabase
    .from("consent_records")
    .select("channel, granted, recorded_at, consent_text_version, consent_text_snapshot")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(200);
  if (error) return { error };
  const latest = latestConsentsByChannel(data);
  return { latest, history: data ?? [], hasAnyRecord: (data ?? []).length > 0 };
}

export async function persistConsentChoices(supabase, userId, choices, latest) {
  const rows = [];
  for (const channel of CHANNELS) {
    const granted = Boolean(choices[channel]);
    const prev = latest[channel];
    if (prev && prev.granted === granted && prev.consent_text_version === CONSENT_VERSION) {
      continue;
    }
    rows.push(consentPayload(userId, channel, granted));
  }
  if (!rows.length) return { ok: true, unchanged: true };
  const { error } = await supabase.from("consent_records").insert(rows);
  if (error) return { ok: false, error };
  return { ok: true, unchanged: false };
}
