// RED-K MOTORS — GTM dataLayer tracking (chargé uniquement après consentement)
(function() {
  if (!window.REDKMotorsCookies || !window.REDKMotorsCookies.hasConsent('analytics')) return;
  var funnel = window.REDKMotorsConversionFunnel;
  if (!funnel) return;

  var pageKey = document.body.getAttribute('data-page') || 'unknown';
  var pagePath = window.location.pathname;

  function resolvePosition(el) {
    if (!el) return '';
    var explicit = el.getAttribute('data-track-pos');
    if (explicit) return explicit;
    if (el.closest('.lead-strip')) return 'lead_strip';
    if (el.closest('.whatsapp-float')) return 'floating';
    if (el.closest('.main-header')) return 'header';
    if (el.closest('.top-bar')) return 'header_top';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.hero')) return 'hero';
    if (el.closest('.service-focus')) return 'service_focus';
    if (el.closest('.pricing-section')) return 'pricing';
    if (el.closest('.appointment')) return 'appointment';
    return 'inline';
  }

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
      pushEvent(el.getAttribute('data-track'), resolvePosition(el));
      return;
    }
    var rdvLink = e.target.closest('a[href="/contact/"], a[href^="/contact/#"], a[href^="/contact?"], a[href^="/contact/?"]');
    if (rdvLink) {
      pushEvent('click_rdv', resolvePosition(rdvLink));
      return;
    }
    var tarifsLink = e.target.closest('a[href="/tarifs/"], a[href^="/tarifs/#"], a[href^="/tarifs?"], a[href^="/tarifs/?"]');
    if (tarifsLink) {
      pushEvent('click_tarifs', resolvePosition(tarifsLink));
      return;
    }
    var link = e.target.closest('a[href^="tel:"]');
    if (link && !link.hasAttribute('data-track')) {
      pushEvent('click_call', resolvePosition(link));
    }
    var waLink = e.target.closest('a[href*="wa.me"]');
    if (waLink && !waLink.hasAttribute('data-track')) {
      pushEvent('click_whatsapp', resolvePosition(waLink));
    }
  });

  var forms = document.querySelectorAll('[data-track-submit]');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function(e) {
      var configured = this.getAttribute('data-track-submit');
      if (!configured) return;
      var resolved = funnel.resolveSubmitEvent(this, e);
      if (resolved === 'form_submit_contact') {
        funnel.markFormSubmitPending();
        pushEvent(configured, 'contact');
      } else if (resolved === 'form_submit_attempt_blocked') {
        pushEvent('form_submit_attempt_blocked', 'contact');
      }
    });
  }
})();
