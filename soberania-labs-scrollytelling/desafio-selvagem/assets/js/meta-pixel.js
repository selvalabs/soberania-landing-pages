/* Eventos complementares; o Pixel e o PageView ficam no <head> de index.html. */
(function () {
  'use strict';

  var productName = 'Rotina Empreendedora Selvagem';
  var offerViewed = false;
  var scrollTracked = false;

  function track(eventName, parameters) {
    if (typeof window.fbq === 'function') window.fbq('track', eventName, parameters || {});
  }

  function trackCustom(eventName, parameters) {
    if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName, parameters || {});
  }

  function trackOfferView() {
    if (offerViewed) return;
    offerViewed = true;
    track('ViewContent', { content_name: productName, content_category: 'Oferta' });
  }

  function setupOfferVisibility() {
    var offer = document.getElementById('oferta');
    if (!offer) return;
    if (!('IntersectionObserver' in window)) {
      trackOfferView();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackOfferView();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(offer);
  }

  function setupCtaTracking() {
    document.addEventListener('click', function (event) {
      var cta = event.target && event.target.closest ? event.target.closest('[data-meta-cta]') : null;
      if (!cta) return;
      trackCustom('OfferCtaClick', {
        content_name: productName,
        cta_id: cta.getAttribute('data-meta-cta') || cta.getAttribute('data-track-id') || 'unidentified_cta',
        destination: cta.hasAttribute('data-kiwify-checkout') ? 'kiwify_checkout' : 'landing'
      });
    });
  }

  function setupScrollDepthTracking() {
    window.addEventListener('scroll', function () {
      if (scrollTracked) return;
      var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      if (documentHeight > 0 && ((window.scrollY + window.innerHeight) / documentHeight) >= 0.9) {
        scrollTracked = true;
        trackCustom('ScrollDepth', { percent: 90, content_name: productName });
      }
    }, { passive: true });
  }

  function initialize() {
    setupOfferVisibility();
    setupCtaTracking();
    setupScrollDepthTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
