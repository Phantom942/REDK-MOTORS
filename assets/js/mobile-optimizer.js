// RED-K MOTORS - Mobile Optimizer (allégé)
(function() {
  'use strict';
  var ua = navigator.userAgent;
  var isMobile = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  var isSmall = window.matchMedia('(max-width: 1024px)').matches;

  if (isMobile) document.body.classList.add('is-mobile');
  if (isSmall) document.body.classList.add('is-small-screen');

  function init() {
    if (navigator.connection && /2g|slow/.test(navigator.connection.effectiveType || '')) {
      document.body.classList.add('is-slow-connection');
    }
    if (isSmall) {
      document.querySelectorAll('[data-animate]').forEach(function(el) {
        el.style.transitionDuration = '0.3s';
      });
    }

    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var y = window.pageYOffset;
      if (Math.abs(y - lastScroll) > 50) {
        if (window.REDKMotorsNav && window.REDKMotorsNav.isOpen && window.REDKMotorsNav.isOpen()) {
          window.REDKMotorsNav.setOpen(false);
        }
      }
      lastScroll = y;
    }, { passive: true });

    function fixInputFontSize(root) {
      (root || document).querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="search"], input[type="password"], textarea, select').forEach(function(input) {
        if (window.innerWidth < 768 && parseInt(window.getComputedStyle(input).fontSize, 10) < 16) {
          input.style.fontSize = '16px';
        }
      });
    }

    fixInputFontSize();

    if (window.MutationObserver && document.body) {
      var inputObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) fixInputFontSize(node);
          });
        });
      });
      inputObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  window.REDKMotorsMobile = { isMobile: isMobile, isSmallScreen: isSmall };
})();
