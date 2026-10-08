import { CONSENT_TEXT, CONSENT_VERSION } from "./config.js";

const PENDING_KEY = "mp_pending_consents_v1";

const CHANNELS = ["email_marketing", "sms_marketing", "whatsapp_marketing"];

export function consentPayload(userId, channel, granted) {
  return {
    user_id: userId,
    channel,
    granted: Boolean(granted),
    consent_text_version: CONSENT_VERSION,
    consent_text_snapshot: CONSENT_TEXT[channel],
  };
}

export function queuePendingConsentsFromForm(fd) {
  const payload = {
    email_marketing: Boolean(fd.get("consent_email")),
    sms_marketing: Boolean(fd.get("consent_sms")),
    whatsapp_marketing: Boolean(fd.get("consent_whatsapp")),
    consent_text_version: CONSENT_VERSION,
    saved_at: new Date().toISOString(),
  };
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

export function clearPendingConsents() {
  localStorage.removeItem(PENDING_KEY);
}

export async function flushPendingConsents(supabase, userId) {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return { ok: true, applied: false };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearPendingConsents();
    return { ok: false, error: "invalid_pending" };
  }
  if (parsed.consent_text_version !== CONSENT_VERSION) {
    clearPendingConsents();
    return { ok: true, applied: false, skipped: "version_mismatch" };
  }
  const rows = CHANNELS.map((channel) =>
    consentPayload(userId, channel, Boolean(parsed[channel])),
  );
  const { error } = await supabase.from("consent_records").insert(rows);
  if (error) return { ok: false, error };
  clearPendingConsents();
  return { ok: true, applied: true };
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
  return { latest, history: data ?? [] };
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
