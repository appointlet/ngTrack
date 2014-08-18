// Keen.io
// Docs: https://github.com/keenlabs/keen-js

(function() {
  'use strict';

  angular.module('ngTrack')

  // Register Keenio backend
  .config(['$analyticsProvider',
    function($analyticsProvider) {
      $analyticsProvider.register('Keenio');
    }
  ])

  // Define Keen.io's analytics backend
  .provider('Keenio', function() {
    var config, src;

    this.configure = function(c) {
      config = c;

      if (config.readKey) {
        src = '//d26b395fwzu5fz.cloudfront.net/3.0.7/keen.min.js';
      } else {
        src = '//d26b395fwzu5fz.cloudfront.net/3.0.7/keen-tracker.min.js';
      }
    };

    this.$get = ['$window',
      function($window) {
        return {
          // Put the script tag on the `src` attribute so it will be loaded
          // automatically.
          src: src,

          // Creates a new Keen client with the configuration.
          // https://github.com/keenlabs/keen-js#quick-setup
          initialize: function() {
            this.client = new $window.Keen(config);
          },

          // https://github.com/keenlabs/keen-js#tracking-events
          track: function() {
            this.client.addEvent.apply(this.client, arguments);
          },

          // https://github.com/keenlabs/keen-js#tracking-events
          trackPage: function(path) {
            this.client.addEvent('Page Viewed', {
              url: path
            });
          },

          // https://github.com/keenlabs/keen-js/wiki/Track#set-global-properties
          register: function() {
            this.client.setGlobalProperties.apply(this.client, arguments);
          },
        };
      }
    ];
  });
})();
