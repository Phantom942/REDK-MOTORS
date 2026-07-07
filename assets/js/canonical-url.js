/**
 * GitHub Pages : pas de 301 serveur. Normalise l'URL affichée vers la forme canonique
 * (sans index.html, avec slash final) pour limiter les doublons GSC.
 */
(function () {
  var path = window.location.pathname || "/";

  if (path.endsWith("/index.html")) {
    var base = path.slice(0, -"/index.html".length) || "/";
    var target = base === "/" ? "/" : base + "/";
    if (target !== path) {
      window.location.replace(target);
      return;
    }
  }

  if (path.length > 1 && !path.endsWith("/") && path.indexOf(".") === -1) {
    window.location.replace(path + "/");
  }
})();
