// RED-K MOTORS - Mobile Optimizer
// Détection et optimisations spécifiques mobile

(function() {
  'use strict';

  // Détection du type d'appareil
  const isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  // Détection de la taille d'écran
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  const isVerySmallScreen = window.matchMedia('(max-width: 480px)').matches;
  const isTablet = window.matchMedia('(min-width: 481px) and (max-width: 1024px)').matches;
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

  // Ajouter une classe au body pour cibler facilement les appareils
  if (isMobile.any()) {
    document.body.classList.add('is-mobile');
    if (isMobile.iOS()) {
      document.body.classList.add('is-ios');
    }
    if (isMobile.Android()) {
      document.body.classList.add('is-android');
    }
  }

  if (isSmallScreen) {
    document.body.classList.add('is-small-screen');
  }

  if (isVerySmallScreen) {
    document.body.classList.add('is-very-small-screen');
  }

  if (isTablet) {
    document.body.classList.add('is-tablet');
  }

  if (isDesktop) {
    document.body.classList.add('is-desktop');
  }

  // Optimisations spécifiques mobile
  function optimizeForMobile() {
    // Désactiver les vidéos automatiques sur mobile si connexion lente
    if (navigator.connection) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      // Si connexion 2G ou slow, désactiver la vidéo
      if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
        const videos = document.querySelectorAll('.hero__video-player');
        videos.forEach(video => {
          video.pause();
          video.style.display = 'none';
        });
      }
    }

    // Optimiser les images pour mobile (lazy loading déjà en place)
    if (isMobile.any() || isSmallScreen) {
      // Augmenter le rootMargin pour le lazy loading sur mobile
      if (window.imageObserver) {
        window.imageObserver.rootMargin = '100px';
      }

      // Désactiver certaines animations lourdes sur mobile
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        // Animation plus simple sur mobile
        el.style.transitionDuration = '0.3s';
      });
    }

    // Optimiser le menu mobile
    if (isSmallScreen) {
      const navToggle = document.querySelector('.main-nav__toggle');
      const navMenu = document.querySelector('#primary-menu');
      
      // Fermer le menu au scroll sur mobile
      let lastScroll = 0;
      window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (navMenu && navMenu.classList.contains('is-open')) {
          if (Math.abs(currentScroll - lastScroll) > 50) {
            navMenu.classList.remove('is-open');
            if (navToggle) {
              navToggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
        lastScroll = currentScroll;
      });
    }

    // Améliorer le tap sur mobile (supprimer le delay iOS)
    document.addEventListener('touchstart', function() {}, { passive: true });

    // Optimiser les formulaires pour mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Éviter le zoom sur iOS lors du focus
      if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.tagName === 'TEXTAREA') {
        if (window.innerWidth < 768) {
          // Font-size minimum 16px pour éviter le zoom iOS
          const computedStyle = window.getComputedStyle(input);
          if (parseInt(computedStyle.fontSize) < 16) {
            input.style.fontSize = '16px';
          }
        }
      }
    });
  }

  // Prévenir le zoom sur double-tap iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Optimiser les performances sur mobile
  function optimizePerformance() {
    // Réduire la qualité des animations sur mobile
    if (isMobile.any() || isSmallScreen) {
      // Utiliser will-change uniquement pour les éléments actifs
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('touchstart', function() {
          this.style.willChange = 'transform';
        }, { once: true });

        card.addEventListener('touchend', function() {
          setTimeout(() => {
            this.style.willChange = 'auto';
          }, 300);
        });
      });
    }
  }

  // API publique
  window.REDKMotorsMobile = {
    isMobile: isMobile.any(),
    isSmallScreen: isSmallScreen,
    isTablet: isTablet,
    isDesktop: isDesktop,
    
    // Obtenir le type d'appareil
    getDeviceType: function() {
      if (isVerySmallScreen) return 'very-small';
      if (isSmallScreen) return 'mobile';
      if (isTablet) return 'tablet';
      return 'desktop';
    },
    
    // Vérifier si on est sur mobile
    isMobileDevice: function() {
      return isMobile.any();
    }
  };

  // Initialisation
  document.addEventListener('DOMContentLoaded', function() {
    optimizeForMobile();
    optimizePerformance();
  });

  // Optimiser aussi après chargement complet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeForMobile);
  } else {
    optimizeForMobile();
  }
})();
