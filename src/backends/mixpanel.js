// Mixpanel
// Docs: https://mixpanel.com/help/reference/javascript

(function() {
  'use strict';

  angular.module('ngTrack')

  // Register Mixpanel backend
  .config(['$analyticsProvider',
    function($analyticsProvider) {
      $analyticsProvider.register('Mixpanel');
    }
  ])

  // Define mixpanel backend
  .provider('Mixpanel',
    function() {
      var config;

      this.configure = function(c) {
        config = c;
      };

      this.$get = ['$window',
        function($window) {
          // some crap that mixpanel's script needs to see when it loads
          (function(f,b){if(!b.__SV){var a,e,i,g;$window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;}})($window.document, $window.mixpanel || []);
          $window.mixpanel.init('not_initialized');

          return {
            // Location of the Mixpanel tracking library so that ngTrack
            // can load it before initialization.
            src: '//cdn.mxpnl.com/libs/mixpanel-2.2.min.js',

            // Extract the token from the configuration blob and set it on the
            // now loaded mixpanel object.
            // https://mixpanel.com/help/reference/javascript#installing
            initialize: function() {
              $window.mixpanel.init(config.token);
            },

            // https://mixpanel.com/help/reference/javascript#user-identity
            identify: function(id) {
              $window.mixpanel.identify(id);
            },

            // https://mixpanel.com/help/reference/javascript#user-identity
            alias: function(newID) {
              $window.mixpanel.alias(newID);
            },

            // https://mixpanel.com/help/reference/javascript#super-properties
            register: function(properties) {
              $window.mixpanel.register(properties);
            },

            // https://mixpanel.com/help/reference/javascript#super-properties
            registerOnce: function(properties) {
              $window.mixpanel.register_once(properties);
            },

            // https://mixpanel.com/help/reference/javascript#storing-user-profiles
            peopleSet: function(properties) {
              $window.mixpanel.people.set(properties);
            },

            // https://mixpanel.com/help/reference/javascript#storing-user-profiles
            peopleSetOnce: function(properties) {
              $window.mixpanel.people.set_once(properties);
            },

            // https://mixpanel.com/help/reference/javascript#sending-events
            track: function() {
              $window.mixpanel.track.apply($window.mixpanel, arguments);
            },

            // Mixpanel doesn't have page tracking, they are just an event.
            // https://mixpanel.com/help/reference/javascript#sending-events
            trackPage: function(path) {
              $window.mixpanel.track('Page Viewed', {
                url: path
              });
            }
          };
        }
      ];
    }
  );
})();
