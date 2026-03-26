/**
 * RED-K MOTORS — filtres client sur la grille d'annonces (page achat-revente)
 */
(function () {
  var grid = document.getElementById("marketplace-grid");
  if (!grid) return;

  var cards = grid.querySelectorAll("[data-listing]");
  var search = document.getElementById("marketplace-search");
  var brand = document.getElementById("marketplace-brand");
  var fuel = document.getElementById("marketplace-fuel");
  var priceMax = document.getElementById("marketplace-price-max");
  var resetBtn = document.getElementById("marketplace-reset");
  var emptyState = document.getElementById("marketplace-empty");

  var brands = new Set();
  cards.forEach(function (card) {
    var b = card.getAttribute("data-brand");
    if (b) brands.add(b);
  });
  Array.from(brands)
    .sort(function (a, b) {
      return a.localeCompare(b, "fr");
    })
    .forEach(function (b) {
      var opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      brand.appendChild(opt);
    });

  function applyFilters() {
    var q = (search && search.value ? search.value : "").toLowerCase().trim();
    var br = brand && brand.value ? brand.value : "";
    var fu = fuel && fuel.value ? fuel.value : "";
    var pMax = priceMax && priceMax.value ? parseInt(priceMax.value, 10) : NaN;
    if (isNaN(pMax) || pMax <= 0) pMax = Infinity;

    var visible = 0;
    cards.forEach(function (card) {
      var show = true;
      var title = (card.getAttribute("data-title") || "").toLowerCase();
      var cardBrand = card.getAttribute("data-brand") || "";
      var cardFuel = card.getAttribute("data-fuel") || "";
      var cardPrice = parseInt(card.getAttribute("data-price") || "0", 10) || 0;

      if (q && title.indexOf(q) === -1) show = false;
      if (br && cardBrand !== br) show = false;
      if (fu && cardFuel !== fu) show = false;
      if (cardPrice > pMax) show = false;

      card.toggleAttribute("hidden", !show);
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  ["input", "change"].forEach(function (ev) {
    if (search) search.addEventListener(ev, applyFilters);
    if (brand) brand.addEventListener(ev, applyFilters);
    if (fuel) fuel.addEventListener(ev, applyFilters);
    if (priceMax) priceMax.addEventListener(ev, applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (search) search.value = "";
      if (brand) brand.value = "";
      if (fuel) fuel.value = "";
      if (priceMax) priceMax.value = "";
      applyFilters();
    });
  }
})();
