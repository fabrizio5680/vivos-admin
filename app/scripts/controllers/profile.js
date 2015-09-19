'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:CompleteCtrl
 * @description
 * # CompleteCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $routeParams, apiClient) {

      var getUrlPath = function () {
        return $routeParams.profileId;
      };

      var init = function () {
        $rootScope.formLayout = false;
        $rootScope.formLayoutAnimate = false;

        var profileId = getUrlPath();
        var map = {};

        apiClient.getProfile({questionnareId: 15, userId: profileId}).then(function (response) {
          angular.forEach(response.result, function (value, key) {
            try {
              map[key] = JSON.parse(value);
            } catch (e) {
              map[key] = value;
            }
          });
          delete map.id;
          delete map.kind;
          delete map.etag;
          $scope.profile = map;
        });

      };
      init();
    });
