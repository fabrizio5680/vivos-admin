'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:CompleteCtrl
 * @description
 * # CompleteCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('ProfileCtrl', function ($scope, $rootScope, $sce, $mdDialog, $log, $routeParams, profileHandler, $mdSidenav) {

    var getUrlPath = function () {
      return profileHandler.getProfile();
    };

    var selectedUser = {};

    var iframe = null;

    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };

    var DialogController = function ($scope, $mdDialog) {
      $scope.firstName = selectedUser.firstName.value;
      $scope.iframe = $sce.trustAsHtml(selectedUser.iframe);

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.print = function () {
        window.print();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    };


    $scope.showCV = function (ev, user) {
      try {
        var cv = user[34].value;
      } catch (e) {

      }

      cv = 'https://docs.google.com/gview?url=' + cv + '&embedded=true';
      iframe = '<iframe class="doc" src="' + cv + '"></iframe>';

      selectedUser.iframe = iframe;
      selectedUser.firstName = user[2];

      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/views/templates/doc-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
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

    $scope.isArray = function (value) {
      return angular.isArray(value) || angular.isObject(value);
    };

    $scope.$on('toggleOpen', init);
  });
