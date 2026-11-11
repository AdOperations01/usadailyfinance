/**
 * Beacon Tracking Script
 * Tracks clicks on elements with class 'clicksterTag'
 * - Sends beacon when data-track-url is present (optional beacon feature)
 * - Always pushes offer_click to GTM dataLayer for GA4 tracking
 */
document.addEventListener('DOMContentLoaded', function () {
  var clicksterLinks = document.querySelectorAll('a.clicksterTag');

  clicksterLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var trackUrl = this.getAttribute('data-track-url');
      var elementId = this.getAttribute('id') || 'unknown';

      // Send beacon only when the beacon feature is enabled (data-track-url present)
      if (trackUrl) {
        var elementHref = encodeURIComponent(this.getAttribute('href') || '');
        var fullBeaconUrl = trackUrl + '&element_id=' + elementId + '&element_href=' + elementHref;

        if (navigator.sendBeacon) {
          navigator.sendBeacon(fullBeaconUrl);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', fullBeaconUrl, true);
          xhr.send();
        }
      }

      // Always push offer_click to GTM dataLayer so GA4 records the event with the
      // correct client_id and session context already established by the GTM tag
      if (window.dataLayer) {
        var tracking = window.clicksterTracking || {};
        window.dataLayer.push({
          event: 'offer_click',
          offer_id: tracking.offer_id || '',
          interaction_id: tracking.interaction_id || '',
          campaign_id: tracking.campaign_id || '',
          element_id: elementId,
        });
      }

      // Let the default link behavior continue
      return true;
    });
  });
});
