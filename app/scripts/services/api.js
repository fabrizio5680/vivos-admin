'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.api
 * @description
 * # api
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('api', function api($q, $window, $timeout, $rootScope, $gapi) {

    var service = {};

    service.init = function () {
      service.API_CLIENT = 'client';
      service.API_ADMIN = 'admin';

      service.EVENT_GAPI_READY = 'api.gapiReady';

      service.endpointTimeout = 5000;

      service.apiStatus = {};

      service.executeQueue = [];

      $rootScope.gapiReady = false;

      service.endpoints = {};
      service.endpoints[service.API_CLIENT] = { name: service.API_CLIENT, v: 'v1' };
      service.endpoints[service.API_ADMIN] = { name: service.API_ADMIN, v: 'v1' };

      // Preload API
      $gapi.loaded.then(function () {
        $gapi.load(service.API_CLIENT, service.endpoints[service.API_CLIENT].v, true);
        $gapi.load(service.API_ADMIN, service.endpoints[service.API_ADMIN].v, true);
      });
    };


    service.setToken = function (token) {
      $gapi.loaded.then(function () {
        window.gapi.auth.setToken({
          access_token: token
        });
      });
    };


    /**
     * Send Method for all API endpoint calls.
     * @param api
     * @param methods
     * @param payload
     * @returns {*}
     */
    service.execute = function (api, methods, payload) {
      var gapi, i, deferred = $q.defer();


      $gapi.loaded.then(function () {
        $gapi.load(api, service.endpoints[api].v, true).then(function () {
          try {
            gapi = $window.gapi.client[api];

            methods = [].concat(methods);

            for (i = 0; i < methods.length; i += 1) {
              if (gapi[methods[i]]) {
                gapi = gapi[methods[i]];
              }
            }
            gapi(payload).execute(function (data) {
              $timeout(function () {
                $rootScope.$apply(function () {
                  deferred.resolve(data);
                });
              });
            });

          } catch (e) {
            $timeout(function () {
              $rootScope.$apply(function () {
                deferred.reject({"error": e });
              });
            });
          }

        }, function () {
          console.log('failed to load ' + api + ' ENDPOINT');
        });
      }, function () {
        console.log('failed to load gapi object');
      });

      return deferred.promise;
    };


    service.init();



    return service;
  });
