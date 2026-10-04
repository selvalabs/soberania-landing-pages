/* Mantém o CTA do topo dentro dos eventos suportados pelo API Tracker. */
(function () {
  'use strict';

  var heroOffer = document.querySelector('[data-track-id="hero_offer"]');
  if (heroOffer) {
    heroOffer.setAttribute('data-track-event', 'click_cta');
  }
}());
