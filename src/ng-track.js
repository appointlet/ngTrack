(function() {
  'use strict';

  angular.module('ngTrack', []).provider('$analytics', function() {
    var backends = [];

    // Convenience function for iterating through backends
    var eachBackend = function(cb) {
      return angular.forEach(backends, cb);
    };

    // Registers a new backend
    this.register = function(backend) {
      backends.push(backend);
    };

    // Expose the API for analytics calls
    this.$get = ['$injector', '$location', '$q', '$document', '$timeout',
      function($injector, $location, $q, $document, $timeout) {
        var backendsLoaded = $q.defer(),
          qs = [];

        // map over the backend identifiers with the actual service
        eachBackend(function(backend, idx) {
          backends[idx] = $injector.get(backend);
        });

        // check each backend for a script that we will load for them
        eachBackend(function(backend) {
          if (!backend.src) {
            return;
          }

          // thank you https://github.com/urish/angular-load
          var deferred = $q.defer();
          var script = $document[0].createElement('script');
          script.onload = function(e) {
            $timeout(function() {
              deferred.resolve(e);
            });
          };
          script.onerror = function(e) {
            $timeout(function() {
              deferred.reject(e);
            });
          };
          script.src = backend.src;
          script.async = true;
          $document[0].body.appendChild(script);

          qs.push(deferred.promise);
        });

        // when the scripts all load, resolve the backendsLoaded promise
        $q.all(qs).then(backendsLoaded.resolve, backendsLoaded.reject);

        // Calls a method on all of the backends with the given arguments
        var invoke = function(method, args) {
          backendsLoaded.promise.then(function() {
            eachBackend(function(backend) {
              if (backend[method]) {
                backend[method].apply(backend, args);
              }
            });
          });
        };

        // When the backends have loaded their scripts, call initialize
        // on each one.
        backendsLoaded.promise.then(function() {
            eachBackend(function(backend) {
              backend.initialize();
            });
        });

        return {
          identify: function() {
            invoke('identify', arguments);
          },
          register: function() {
            invoke('register', arguments);
          },
          registerOnce: function() {
            invoke('registerOnce', arguments);
          },
          peopleSet: function() {
            invoke('peopleSet', arguments);
          },
          peopleSetOnce: function() {
            invoke('peopleSetOnce', arguments);
          },
          track: function() {
            invoke('track', arguments);
          },
          trackPage: function(path) {
            invoke('trackPage', [path || $location.path]);
          },
        };
      }
    ];
  });
})();
