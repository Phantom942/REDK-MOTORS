/**
 * RED-K MOTORS - Lazy loading des vidéos hero
 * Desktop : charge la vidéo quand le hero entre dans le viewport.
 * Mobile (< 769px) : pas de vidéo, le poster + overlay suffisent.
 */
(function() {
  'use strict';

  var isMobile = window.innerWidth < 769;

  if (isMobile) {
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.hero__video-player').forEach(function(video) {
        video.removeAttribute('autoplay');
        video.pause();
        video.style.display = 'none';
      });
    });
    return;
  }

  var hasUnlocked = false;

  function unlockVideos() {
    if (hasUnlocked) return;
    hasUnlocked = true;
    document.querySelectorAll('.hero__video-player').forEach(function(video) {
      if (video.paused) {
        video.play().catch(function() {});
      }
    });
  }

  document.addEventListener('click', unlockVideos, { once: true, passive: true });
  document.addEventListener('touchstart', unlockVideos, { once: true, passive: true });

  function loadAndPlayHeroVideo(video) {
    var sources = video.querySelectorAll('source[data-src]');
    sources.forEach(function(source) {
      var src = source.getAttribute('data-src');
      if (src) {
        source.setAttribute('src', src);
        source.removeAttribute('data-src');
      }
    });
    video.load();
    video.play().catch(function() {});
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var video = entry.target;
        loadAndPlayHeroVideo(video);
        observer.unobserve(video);
      }
    });
  }, { rootMargin: '50px', threshold: 0.1 });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.hero__video-player').forEach(function(video) {
      if (video.querySelector('source[data-src]')) {
        observer.observe(video);
      }
    });
  });
})();
