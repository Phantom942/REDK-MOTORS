// RED-K MOTORS - Mobile Optimizer (allégé)
(function() {
  'use strict';
  var ua = navigator.userAgent;
  var isMobile = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  var isSmall = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) document.body.classList.add('is-mobile');
  if (isSmall) document.body.classList.add('is-small-screen');

  function init() {
    if (navigator.connection && /2g|slow/.test(navigator.connection.effectiveType || '')) {
      document.querySelectorAll('.hero__video-player').forEach(function(v) {
        v.pause();
        v.style.display = 'none';
      });
    }
    if (isSmall) {
      document.querySelectorAll('[data-animate]').forEach(function(el) {
        el.style.transitionDuration = '0.3s';
      });
      var nav = document.querySelector('#primary-menu');
      var toggle = document.querySelector('.main-nav__toggle');
      var lastScroll = 0;
      window.addEventListener('scroll', function() {
        var y = window.pageYOffset;
        if (nav && nav.classList.contains('is-open') && Math.abs(y - lastScroll) > 50) {
          nav.classList.remove('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
        lastScroll = y;
      }, { passive: true });
    }
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(function(input) {
      if (window.innerWidth < 768 && parseInt(window.getComputedStyle(input).fontSize, 10) < 16) {
        input.style.fontSize = '16px';
      }
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  window.REDKMotorsMobile = { isMobile: isMobile, isSmallScreen: isSmall };
})();
