// RED-K MOTORS - Gestion des cookies RGPD

(function() {
  'use strict';

  // Configuration
  const COOKIE_CONSENT_NAME = 'redk-motors-cookie-consent';
  const COOKIE_EXPIRY_DAYS = 365;
  const CONSENT_VERSION = '1.0';

  // Types de cookies
  const COOKIE_TYPES = {
    ESSENTIELS: 'essentiels',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing'
  };

  // État du consentement
  let consentState = {
    essentiels: true, // Toujours activés
    analytics: false,
    marketing: false,
    version: CONSENT_VERSION,
    date: null
  };

  // Fonctions utilitaires
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + JSON.stringify(value) + ';' + expires + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(c.substring(nameEQ.length, c.length));
        } catch (e) {
          return c.substring(nameEQ.length, c.length);
        }
      }
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // Charger le consentement sauvegardé
  function loadConsent() {
    const saved = getCookie(COOKIE_CONSENT_NAME);
    if (saved && saved.version === CONSENT_VERSION) {
      consentState = saved;
      return true;
    }
    return false;
  }

  // Sauvegarder le consentement
  function saveConsent() {
    consentState.date = new Date().toISOString();
    setCookie(COOKIE_CONSENT_NAME, consentState, COOKIE_EXPIRY_DAYS);
  }

  // Créer le bandeau de consentement
  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-live', 'polite');
    
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__content">
          <h2 id="cookie-banner-title" class="cookie-banner__title">Gestion des cookies</h2>
          <p class="cookie-banner__text">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Certains cookies sont nécessaires au fonctionnement du site, d'autres nous aident à analyser 
            l'utilisation du site ou à vous proposer des contenus personnalisés.
          </p>
          <p class="cookie-banner__text">
            <a href="confidentialite.html">Politique de confidentialité</a> | 
            <a href="cookies.html">Politique de cookies</a>
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button id="cookie-accept-all" class="btn btn--primary cookie-banner__btn">Tout accepter</button>
          <button id="cookie-reject-all" class="btn btn--ghost cookie-banner__btn">Tout refuser</button>
          <button id="cookie-customize" class="btn btn--ghost cookie-banner__btn">Personnaliser</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Gestionnaires d'événements
    document.getElementById('cookie-accept-all').addEventListener('click', acceptAllCookies);
    document.getElementById('cookie-reject-all').addEventListener('click', rejectAllCookies);
    document.getElementById('cookie-customize').addEventListener('click', showCustomizePanel);
  }

  // Créer le panneau de personnalisation
  function createCustomizePanel() {
    const panel = document.createElement('div');
    panel.id = 'cookie-customize-panel';
    panel.className = 'cookie-customize-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'cookie-customize-title');
    
    panel.innerHTML = `
      <div class="cookie-customize-panel__inner">
        <div class="cookie-customize-panel__content">
          <h2 id="cookie-customize-title" class="cookie-customize-panel__title">Personnaliser les cookies</h2>
          
          <div class="cookie-customize-panel__section">
            <div class="cookie-option">
              <div class="cookie-option__header">
                <label class="cookie-option__label">
                  <input type="checkbox" id="cookie-essentiels" checked disabled />
                  <span>Cookies essentiels</span>
                </label>
              </div>
              <p class="cookie-option__description">
                Ces cookies sont nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.
              </p>
            </div>
          </div>

          <div class="cookie-customize-panel__section">
            <div class="cookie-option">
              <div class="cookie-option__header">
                <label class="cookie-option__label">
                  <input type="checkbox" id="cookie-analytics" />
                  <span>Cookies analytiques</span>
                </label>
              </div>
              <p class="cookie-option__description">
                Ces cookies nous permettent d'analyser l'utilisation du site pour l'améliorer. 
                (Google Analytics, Google Tag Manager)
              </p>
            </div>
          </div>

          <div class="cookie-customize-panel__section">
            <div class="cookie-option">
              <div class="cookie-option__header">
                <label class="cookie-option__label">
                  <input type="checkbox" id="cookie-marketing" />
                  <span>Cookies marketing</span>
                </label>
              </div>
              <p class="cookie-option__description">
                Ces cookies permettent de vous proposer des contenus et publicités personnalisés.
              </p>
            </div>
          </div>
        </div>
        
        <div class="cookie-customize-panel__actions">
          <button id="cookie-save-preferences" class="btn btn--primary">Enregistrer mes préférences</button>
          <button id="cookie-cancel-customize" class="btn btn--ghost">Annuler</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Mettre à jour les checkboxes avec l'état actuel
    document.getElementById('cookie-analytics').checked = consentState.analytics;
    document.getElementById('cookie-marketing').checked = consentState.marketing;
    
    // Gestionnaires d'événements
    document.getElementById('cookie-save-preferences').addEventListener('click', savePreferences);
    document.getElementById('cookie-cancel-customize').addEventListener('click', hideCustomizePanel);
    
    // Fermer en cliquant à l'extérieur
    panel.addEventListener('click', function(e) {
      if (e.target === panel) {
        hideCustomizePanel();
      }
    });
  }

  // Accepter tous les cookies
  function acceptAllCookies() {
    consentState.analytics = true;
    consentState.marketing = true;
    saveConsent();
    hideCookieBanner();
    loadAnalytics();
    showConsentMessage('Tous les cookies ont été acceptés.');
  }

  // Refuser tous les cookies (sauf essentiels)
  function rejectAllCookies() {
    consentState.analytics = false;
    consentState.marketing = false;
    saveConsent();
    hideCookieBanner();
    removeAnalytics();
    showConsentMessage('Seuls les cookies essentiels sont activés.');
  }

  // Afficher le panneau de personnalisation
  function showCustomizePanel() {
    if (!document.getElementById('cookie-customize-panel')) {
      createCustomizePanel();
    }
    document.getElementById('cookie-customize-panel').classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  // Masquer le panneau de personnalisation
  function hideCustomizePanel() {
    const panel = document.getElementById('cookie-customize-panel');
    if (panel) {
      panel.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  }

  // Sauvegarder les préférences personnalisées
  function savePreferences() {
    consentState.analytics = document.getElementById('cookie-analytics').checked;
    consentState.marketing = document.getElementById('cookie-marketing').checked;
    saveConsent();
    hideCookieBanner();
    hideCustomizePanel();
    
    if (consentState.analytics) {
      loadAnalytics();
    } else {
      removeAnalytics();
    }
    
    showConsentMessage('Vos préférences ont été enregistrées.');
  }

  // Masquer le bandeau
  function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('is-hidden');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  // Afficher un message de confirmation
  function showConsentMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'cookie-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('is-visible');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('is-visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Charger Google Analytics / Tag Manager (si consentement)
  function loadAnalytics() {
    if (consentState.analytics) {
      // Google Tag Manager est déjà chargé dans le HTML
      // On peut déclencher un événement pour signaler le consentement
      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'cookie_consent',
          'analytics': true,
          'marketing': consentState.marketing
        });
      }
    }
  }

  // Retirer les scripts d'analytics
  function removeAnalytics() {
    // Supprimer les cookies analytics existants
    const analyticsCookies = ['_ga', '_gid', '_gat', '_gat_gtag_' + 'GTM-NTC72X2G'.replace(/[^a-zA-Z0-9]/g, '_')];
    analyticsCookies.forEach(cookie => {
      deleteCookie(cookie);
    });
    
    // Signaler à dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'cookie_consent',
        'analytics': false,
        'marketing': false
      });
    }
  }

  // API publique
  window.REDKMotorsCookies = {
    // Obtenir l'état du consentement
    getConsent: function() {
      return Object.assign({}, consentState);
    },
    
    // Vérifier si un type de cookie est accepté
    hasConsent: function(type) {
      if (type === COOKIE_TYPES.ESSENTIELS) {
        return true; // Toujours activé
      }
      return consentState[type] === true;
    },
    
    // Réinitialiser le consentement (pour tests)
    resetConsent: function() {
      deleteCookie(COOKIE_CONSENT_NAME);
      location.reload();
    },
    
    // Ouvrir le panneau de personnalisation
    openPreferences: function() {
      if (!loadConsent()) {
        createCookieBanner();
      } else {
        showCustomizePanel();
      }
    }
  };

  // Initialisation au chargement de la page
  function init() {
    // Vérifier si le consentement existe
    if (!loadConsent()) {
      // Afficher le bandeau de consentement
      createCookieBanner();
    } else {
      // Charger les services selon le consentement
      if (consentState.analytics) {
        loadAnalytics();
      }
    }
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
