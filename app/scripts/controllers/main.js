'use strict';
var json;
/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
    .controller('MainCtrl', function ($scope, $rootScope, $timeout, localStorageService, utils, $location, $routeParams, $sce, apiClient) {



      var dateId = 4;
      var getUrlPath = function () {
        return $routeParams.questionnaireId || 15;
      };

      $scope.setDate = function () {
        $scope.answers[dateId] = moment($scope.dates[dateId]).format('DD/MM/YYYY');
      };
      /**
       * Setup of Controller
       */
      var init = function () {


        apiClient.getUsers({id:15}).then(function (response) {
          $scope.users = response.items;
        });


      };

      $scope.profile = function (id) {
        $location.url('/profile/' + id);
      };


      init();

    });
