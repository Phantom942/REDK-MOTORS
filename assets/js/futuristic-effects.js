/**
 * RED-K MOTORS - Effets légers (allégé)
 */
(function() {
  'use strict';
  function init() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.btn').forEach(function(btn) {
      btn.addEventListener('mouseenter', function(e) {
        var r = document.createElement('span');
        r.className = 'btn-ripple';
        var rect = this.getBoundingClientRect();
        var s = Math.max(rect.width, rect.height);
        r.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - rect.left - s/2) + 'px;top:' + (e.clientY - rect.top - s/2) + 'px';
        this.appendChild(r);
        setTimeout(function() { r.remove(); }, 600);
      });
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
