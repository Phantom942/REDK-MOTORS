/** États visibles du conteneur marketplace (jamais laisser #marketplace-root invisible). */

export function ensureRootVisible(root) {
  if (!root) return;
  root.removeAttribute("hidden");
  root.hidden = false;
}

export function renderLoading(root, message = "Chargement…") {
  ensureRootVisible(root);
  root.setAttribute("aria-busy", "true");
  root.innerHTML = `<div class="mp-state mp-state--loading" role="status"><p>${message}</p></div>`;
}

export function renderFatalError(root, message, retryFn) {
  ensureRootVisible(root);
  root.removeAttribute("aria-busy");
  const retry =
    retryFn === "reload"
      ? `<button type="button" class="btn btn--secondary" data-mp-retry>Réessayer</button>`
      : "";
  root.innerHTML = `<div class="mp-state mp-state--error" role="alert"><p>${message}</p>${retry}</div>`;
  root.querySelector("[data-mp-retry]")?.addEventListener("click", () => window.location.reload());
}

export function renderInfo(root, html) {
  ensureRootVisible(root);
  root.removeAttribute("aria-busy");
  root.innerHTML = `<div class="mp-state mp-state--info" role="status">${html}</div>`;
}
