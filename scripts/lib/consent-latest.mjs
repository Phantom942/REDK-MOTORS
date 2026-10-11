/** État courant = dernière ligne par canal (historique conservé). */
export const CONSENT_CHANNELS = ["email_marketing", "sms_marketing", "whatsapp_marketing"];

export function latestConsentsByChannel(rows) {
  const map = {};
  for (const row of rows ?? []) {
    const prev = map[row.channel];
    if (!prev || new Date(row.recorded_at) > new Date(prev.recorded_at)) {
      map[row.channel] = row;
    }
  }
  return map;
}

/** Réduit les lignes exportées à l'état courant par (user_id, channel). */
export function latestConsentRowsForExport(rows) {
  const map = new Map();
  for (const row of rows ?? []) {
    const key = `${row.user_id}\0${row.channel}`;
    const prev = map.get(key);
    if (!prev || new Date(row.recorded_at) > new Date(prev.recorded_at)) {
      map.set(key, row);
    }
  }
  return [...map.values()].sort(
    (a, b) =>
      String(a.user_id).localeCompare(String(b.user_id)) ||
      String(a.channel).localeCompare(String(b.channel)),
  );
}

export function seedConsentStateOk(latestByChannel) {
  for (const ch of CONSENT_CHANNELS) {
    const row = latestByChannel[ch];
    if (!row || row.granted !== false) return { ok: false, channel: ch, row };
  }
  return { ok: true };
}
