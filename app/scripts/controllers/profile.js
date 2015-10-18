'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:CompleteCtrl
 * @description
 * # CompleteCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('ProfileCtrl', function ($scope, $rootScope, $sce, $mdDialog, $log, $routeParams, apiClient, profileHandler, apiAdmin, $mdSidenav) {

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
      $scope.download = selectedUser.download;
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


    $scope.showCV = function (ev, profile) {
      try {
        var cv = profile[34];
        var raw = profile[34];
      } catch (e) {

      }

      cv = 'https://docs.google.com/gview?url=' + cv + '&embedded=true';
      iframe = '<iframe class="doc" src="' + cv + '"></iframe>';

      selectedUser.iframe = iframe;
      selectedUser.firstName = profile[2];
      selectedUser.download = raw;

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
      $scope.profile = null;
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
      var user = getUrlPath();


      apiClient.getProfile({userId: user.id, questionnareId: 15 }).then(function (profile) {
        var p = {};
        angular.forEach(profile, function (value, key) {
          try {
            p[key] = JSON.parse(value);
          } catch (e) {
            p[key] = angular.isArray(value) ? value[0] : value;
          }
        });
        p.comment = p.comment || user.comment || [];
        formatCommentDate(p);
        $scope.profile = p;
      });
    };

    var formatCommentDate = function (profile) {
      try {
        profile.comment.map(function (comment) {
          comment.dateFormatted = moment(comment.dateAdded).format('MMMM Do YYYY, h:mm:ss a');
        });
      } catch (e) {}
    };


    $scope.sendComment = function () {

      if (!$scope.comment) {
        return;
      }

      $scope.sendingComment = true;
      apiAdmin.comment({questionnaireId: 15, comment: $scope.comment, userId: $scope.profile.id || $scope.profile.id.value}).then(function (profile) {
        $scope.sendingComment = false;
        formatCommentDate(profile);
        $scope.profile.comment = profile.comment;
      });
    };

    $scope.isArray = function (value) {
      return angular.isArray(value) || angular.isObject(value);
    };

    $scope.$on('toggleOpen', init);
  });
