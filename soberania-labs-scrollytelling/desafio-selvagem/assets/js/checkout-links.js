/* Propaga apenas parametros de campanha aceitos pela Kiwify; nunca dados pessoais. */
(function () {
  'use strict';

  var allowedParameters = ['src', 'sck', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 's1', 's2', 's3'];
  var defaults = {
    src: 'landing_rotina',
    utm_source: 'landing',
    utm_medium: 'organic',
    utm_campaign: 'rotina_selvagem_set2026'
  };
  var landingParameters = new URLSearchParams(window.location.search);

  document.querySelectorAll('[data-kiwify-checkout]').forEach(function (link) {
    var checkoutUrl;
    try {
      checkoutUrl = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    allowedParameters.forEach(function (parameter) {
      var landingValue = landingParameters.get(parameter);
      if (landingValue) checkoutUrl.searchParams.set(parameter, landingValue);
    });

    Object.keys(defaults).forEach(function (parameter) {
      if (!checkoutUrl.searchParams.get(parameter)) checkoutUrl.searchParams.set(parameter, defaults[parameter]);
    });

    if (!checkoutUrl.searchParams.get('utm_content')) {
      checkoutUrl.searchParams.set('utm_content', link.getAttribute('data-track-id') || 'checkout_cta');
    }
    link.href = checkoutUrl.toString();
  });
})();
