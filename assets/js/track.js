// RED-K MOTORS — GTM dataLayer tracking (chargé uniquement après consentement)
// Prérequis : conversion-funnel.js déjà exécuté (chargement séquentiel dans cookies.js).
(function() {
  if (window.__REDK_TRACK_BOUND__) return;
  if (!window.REDKMotorsCookies || !window.REDKMotorsCookies.hasConsent('analytics')) return;
  var funnel = window.REDKMotorsConversionFunnel;
  if (!funnel) {
    console.warn('[REDK] track.js: conversion-funnel.js absent — abandon');
    return;
  }

  window.__REDK_TRACK_BOUND__ = true;

  var pageKey = document.body.getAttribute('data-page') || 'unknown';
  var pagePath = window.location.pathname;

  function hasAnalyticsConsent() {
    try {
      if (window.__REDK_ANALYTICS_DISABLED__) return false;
      return !!(window.REDKMotorsCookies && window.REDKMotorsCookies.hasConsent('analytics'));
    } catch (e) {
      return false;
    }
  }

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
    // Re-vérifier le consentement à CHAQUE event (y compris après retrait)
    if (!hasAnalyticsConsent()) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      page_key: pageKey,
      location: pagePath,
      cta_position: ctaPosition || ''
    });
  }

  function onClick(e) {
    if (!hasAnalyticsConsent()) return;
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
  }

  function onSubmit(e) {
    if (!hasAnalyticsConsent()) return;
    var form = e.target;
    if (!form || !form.getAttribute) return;
    var configured = form.getAttribute('data-track-submit');
    if (!configured) return;
    var resolved = funnel.resolveSubmitEvent(form, e);
    if (resolved === 'form_submit_contact') {
      funnel.markFormSubmitPending();
      pushEvent(configured, 'contact');
    } else if (resolved === 'form_submit_attempt_blocked') {
      pushEvent('form_submit_attempt_blocked', 'contact');
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit, true);

  document.addEventListener('redk:analytics-consent-revoked', function() {
    window.__REDK_ANALYTICS_DISABLED__ = true;
  });
})();
