'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:CompleteCtrl
 * @description
 * # CompleteCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('ProfileCtrl', function ($scope, $rootScope, $routeParams, profileHandler, $mdSidenav) {

    var getUrlPath = function () {
      return profileHandler.getProfile();
    };

    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };

    var init = function () {
      //$rootScope.formLayout = false;
      //$rootScope.formLayoutAnimate = false;
      //
      //var profileId = getUrlPath();
      //var map = {};
      //
      //apiClient.getProfile({questionnareId: 15, userId: profileId}).then(function (response) {
      //  angular.forEach(response.result, function (value, key) {
      //    try {
      //      map[key] = JSON.parse(value);
      //    } catch (e) {
      //      map[key] = value;
      //    }
      //  });
      //  delete map.id;
      //  delete map.kind;
      //  delete map.etag;
        $scope.profile = getUrlPath();
      //});

    };

    $scope.$on('toggleOpen', init);
  });
