// RED-K MOTORS — GTM dataLayer tracking (chargé uniquement après consentement)
(function() {
  if (!window.REDKMotorsCookies || !window.REDKMotorsCookies.hasConsent('analytics')) return;
  var pageKey = document.body.getAttribute('data-page') || 'unknown';
  var pagePath = window.location.pathname;

  function pushEvent(eventName, ctaPosition) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_key: pageKey,
      location: pagePath,
      cta_position: ctaPosition || ''
    });
  }

  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-track]');
    if (el) {
      pushEvent(el.getAttribute('data-track'), el.getAttribute('data-track-pos') || '');
      return;
    }
    var link = e.target.closest('a[href^="tel:"]');
    if (link && !link.hasAttribute('data-track')) {
      pushEvent('click_call', 'inline');
    }
    var waLink = e.target.closest('a[href*="wa.me"]');
    if (waLink && !waLink.hasAttribute('data-track')) {
      pushEvent('click_whatsapp', 'inline');
    }
  });

  var forms = document.querySelectorAll('[data-track-submit]');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function() {
      pushEvent(this.getAttribute('data-track-submit'), 'contact');
    });
  }
})();
