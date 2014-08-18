// Google Analytics
// Docs: https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced

(function() {
  'use strict';

  angular.module('ngTrack')

  // Register GoogleAnalytics backend
  .config(['$analyticsProvider',
    function($analyticsProvider) {
      $analyticsProvider.register('GA');
    }
  ])

  // Define Keen.io's analytics backend
  .provider('GA', function() {
    var config;

    this.configure = function(c) {
      config = c;
    };

    this.$get = ['$window',
      function($window) {
        return {
          src: "//www.google-analytics.com/analytics.js",

          // Apply the property ID to GA
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#snippet
          initialize: function() {
            $window.ga('create', config.propertyID, 'auto');
          },

          // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
          track: function(name, properties) {
            $window.ga('send', 'event', {
              eventAction: name,
              eventCategory: properties.category,
              eventLabel: properties.label,
              eventValue: properties.value,
              nonInteraction: properties.nonInteraction,
            });
          },

          trackPage: function() {
            $window.ga('send', 'pageview');
          },
        };
      }
    ];
  });
})();
