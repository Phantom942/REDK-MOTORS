/**
 * RED-K MOTORS — Avis Google via Places API (New)
 * Affiche les vrais avis Google (pas la carte). Sans clé API, les avis statiques du HTML restent visibles.
 */
(function() {
  'use strict';

  var grid = document.getElementById('google-reviews-grid');
  if (!grid) return;

  var apiKey = (grid.getAttribute('data-api-key') || '').trim();
  if (!apiKey) return;

  var placeId = (grid.getAttribute('data-place-id') || '').trim();
  var placeQuery = (grid.getAttribute('data-place-query') || 'RED-K MOTORS, 9 rue Michelet, 94200 Ivry-sur-Seine').trim();
  var maxReviews = parseInt(grid.getAttribute('data-max-reviews') || '4', 10) || 4;
  var ratingEl = document.getElementById('google-reviews-rating');
  var scoreEl = document.getElementById('google-reviews-score');
  var badgeScoreEl = document.getElementById('google-reviews-badge-score');
  var badgeCountEl = document.getElementById('google-reviews-badge-count');
  var starsEl = document.getElementById('google-reviews-stars');

  function starsHtml(rating, starClass) {
    var cls = starClass || 'reviews-section__star';
    var n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    var out = '';
    for (var i = 0; i < 5; i++) {
      out += '<span class="' + cls + '">' + (i < n ? '★' : '☆') + '</span>';
    }
    return out;
  }

  function formatScoreFr(rating) {
    var n = Number(rating);
    if (n % 1 === 0) return n + '/5';
    return n.toFixed(1).replace('.', ',') + '/5';
  }

  function formatCountFr(count) {
    return 'par ' + count + ' avis';
  }

  function updatePills(rating, count) {
    var label = 'Note Google : ' + rating + ' sur 5, ' + count + ' avis';
    document.querySelectorAll('[data-google-pill]').forEach(function(pill) {
      pill.setAttribute('aria-label', label);
      pill.setAttribute('data-rating', String(rating));
      pill.setAttribute('data-count', String(count));
      var scoreEl = pill.querySelector('[data-google-pill-score]');
      var countEl = pill.querySelector('[data-google-pill-count]');
      var starsEl = pill.querySelector('[data-google-pill-stars]');
      if (scoreEl) scoreEl.textContent = formatScoreFr(rating);
      if (countEl) countEl.textContent = formatCountFr(count);
      if (starsEl) starsEl.innerHTML = starsHtml(rating, 'google-pill__star');
    });
  }

  function cardStarsHtml(rating) {
    var n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    var stars = '';
    for (var i = 0; i < n; i++) stars += '★';
    return stars;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function reviewText(review) {
    if (!review || !review.text) return '';
    if (typeof review.text === 'string') return review.text;
    return review.text.text || '';
  }

  function renderReviews(place) {
    var reviews = (place && place.reviews) ? place.reviews.slice(0, maxReviews) : [];
    if (!reviews.length) return;

    var rating = place.rating || 5;
    var count = place.userRatingCount || reviews.length;
    var ratingLabel = 'Note Google : ' + rating + ' sur 5, ' + count + ' avis';

    if (ratingEl) {
      ratingEl.setAttribute('aria-label', ratingLabel);
      ratingEl.setAttribute('data-rating', String(rating));
      ratingEl.setAttribute('data-count', String(count));
    }
    if (scoreEl) scoreEl.textContent = Number(rating).toFixed(1);
    if (badgeScoreEl) badgeScoreEl.textContent = Number(rating).toFixed(1);
    if (badgeCountEl) badgeCountEl.textContent = count + ' avis';
    if (starsEl) starsEl.innerHTML = starsHtml(rating);
    updatePills(rating, count);

    var html = '';
    reviews.forEach(function(review) {
      var author = (review.authorAttribution && review.authorAttribution.displayName) || 'Client Google';
      var authorUri = (review.authorAttribution && review.authorAttribution.uri) || '';
      var text = reviewText(review);
      var r = review.rating || 5;
      html += '<article class="review-card">';
      html += '<div class="review-card__stars" aria-label="' + r + ' sur 5 étoiles">';
      html += '<span aria-hidden="true">' + cardStarsHtml(r) + '</span></div>';
      html += '<p class="review-card__text">' + escapeHtml(text) + '</p>';
      html += '<footer class="review-card__footer">';
      if (authorUri) {
        html += '<a class="review-card__name" href="' + escapeHtml(authorUri) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(author) + '</a>';
      } else {
        html += '<span class="review-card__name">' + escapeHtml(author) + '</span>';
      }
      html += '<span class="review-card__source">Google</span></footer></article>';
    });

    grid.innerHTML = html;
    grid.classList.add('google-reviews--live');
  }

  function findPlaceId() {
    if (placeId) return Promise.resolve(placeId);

    return fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id'
      },
      body: JSON.stringify({ textQuery: placeQuery, languageCode: 'fr' })
    })
      .then(function(res) {
        if (!res.ok) throw new Error('searchText failed');
        return res.json();
      })
      .then(function(data) {
        if (!data.places || !data.places.length) throw new Error('place not found');
        return data.places[0].id;
      });
  }

  function fetchPlaceReviews(id) {
    return fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(id), {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount,displayName,googleMapsUri'
      }
    })
      .then(function(res) {
        if (!res.ok) throw new Error('place details failed');
        return res.json();
      });
  }

  grid.classList.add('google-reviews--loading');

  findPlaceId()
    .then(fetchPlaceReviews)
    .then(renderReviews)
    .catch(function() {
      /* Garde les avis statiques du HTML en cas d'erreur */
    })
    .finally(function() {
      grid.classList.remove('google-reviews--loading');
    });
})();
