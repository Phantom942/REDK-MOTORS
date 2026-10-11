/** Sonde HTTP des Edge Functions locales (pas seulement PID). */

export async function probeEdgeFunctions(baseUrl, timeoutMs = 8000) {
  const url = `${baseUrl.replace(/\/$/, "")}/functions/v1/process-listing-photo`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "POST", signal: ctrl.signal });
    return { ok: res.status === 401 || res.status === 400 || res.status === 405, status: res.status };
  } catch (e) {
    return { ok: false, error: e.message ?? "fetch_failed" };
  } finally {
    clearTimeout(t);
  }
}

export async function waitForEdgeFunctions(baseUrl, timeoutMs = 120000) {
  const start = Date.now();
  await new Promise((r) => setTimeout(r, 3000));
  while (Date.now() - start < timeoutMs) {
    const r = await probeEdgeFunctions(baseUrl, 5000);
    if (r.ok) return r;
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Edge functions non joignables (${baseUrl})`);
}
