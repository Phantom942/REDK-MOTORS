/**
 * RED-K MOTORS - Chargement différé des vidéos hero
 * Une seule source (mobile ou desktop), après idle/viewport, sans autoplay HTML.
 */
(function() {
  'use strict';

  var hasUnlocked = false;
  var mobileQuery = window.matchMedia('(max-width: 768px)');

  function getConnection() {
    return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  }

  function shouldSkipVideo() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    var conn = getConnection();
    if (!conn) {
      return false;
    }
    if (conn.saveData) {
      return true;
    }
    return /(^2g$|^slow-2g$|2g|slow)/.test(conn.effectiveType || '');
  }

  function pickVideoSrc(video) {
    var desktop = video.getAttribute('data-video-desktop');
    var mobile = video.getAttribute('data-video-mobile');
    if (mobileQuery.matches && mobile) {
      return mobile;
    }
    return desktop;
  }

  function markSkipped(video) {
    video.classList.add('is-video-skipped');
    video.removeAttribute('data-video-desktop');
    video.removeAttribute('data-video-mobile');
  }

  function unlockVideos() {
    if (hasUnlocked) {
      return;
    }
    hasUnlocked = true;
    document.querySelectorAll('.hero__video-player:not(.is-video-skipped)').forEach(function(video) {
      if (video.paused && video.readyState >= 2) {
        video.play().catch(function() {});
      }
    });
  }

  document.addEventListener('click', unlockVideos, { once: true, passive: true });
  document.addEventListener('touchstart', unlockVideos, { once: true, passive: true });

  function loadAndPlayHeroVideo(video) {
    if (video.dataset.loaded === 'true' || video.classList.contains('is-video-skipped')) {
      return;
    }

    var src = pickVideoSrc(video);
    if (!src) {
      markSkipped(video);
      return;
    }

    var source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.dataset.loaded = 'true';
    video.load();
    video.play().catch(function() {});
  }

  function observeHeroVideo(video) {
    if (!('IntersectionObserver' in window)) {
      loadAndPlayHeroVideo(video);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          loadAndPlayHeroVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '120px 0px', threshold: 0.01 });

    observer.observe(video);
  }

  function initHeroVideos() {
    document.querySelectorAll('.hero__video-player').forEach(function(video) {
      if (shouldSkipVideo()) {
        markSkipped(video);
        return;
      }
      observeHeroVideo(video);
    });
  }

  function scheduleInit() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initHeroVideos, { timeout: 1500 });
    } else {
      setTimeout(initHeroVideos, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  } else {
    scheduleInit();
  }
})();
