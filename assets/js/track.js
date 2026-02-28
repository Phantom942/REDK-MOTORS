// RED-K MOTORS — GTM dataLayer tracking + offer banner + contact chips
(function() {
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

  // Track tel: and whatsapp clicks via data attributes
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-track]');
    if (el) {
      pushEvent(el.getAttribute('data-track'), el.getAttribute('data-track-pos') || '');
      return;
    }
    // Fallback: track any tel: link
    var link = e.target.closest('a[href^="tel:"]');
    if (link && !link.hasAttribute('data-track')) {
      pushEvent('click_call', 'inline');
    }
    // Fallback: track any wa.me link
    var waLink = e.target.closest('a[href*="wa.me"]');
    if (waLink && !waLink.hasAttribute('data-track')) {
      pushEvent('click_whatsapp', 'inline');
    }
  });

  // Track form submissions
  var forms = document.querySelectorAll('[data-track-submit]');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function() {
      pushEvent(this.getAttribute('data-track-submit'), 'contact');
    });
  }

  // Offer banner dismiss with 7-day localStorage
  var banner = document.getElementById('offer-banner');
  var closeBtn = document.getElementById('offer-banner-close');
  if (banner && closeBtn) {
    var dismissed = localStorage.getItem('offer_banner_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) {
      banner.style.display = 'none';
    }
    closeBtn.addEventListener('click', function() {
      banner.style.display = 'none';
      localStorage.setItem('offer_banner_dismissed', Date.now().toString());
    });
  }

  // Contact form chips
  var chips = document.querySelectorAll('.form__chip');
  var messageField = document.getElementById('message');
  for (var j = 0; j < chips.length; j++) {
    chips[j].addEventListener('click', function() {
      for (var k = 0; k < chips.length; k++) chips[k].classList.remove('is-active');
      this.classList.add('is-active');
      if (messageField) {
        var current = messageField.value.trim();
        var motif = this.getAttribute('data-chip');
        if (!current) {
          messageField.value = 'Bonjour, je souhaite un rendez-vous pour : ' + motif + '. ';
        }
        messageField.focus();
      }
    });
  }
})();
