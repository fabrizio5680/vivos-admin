'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('WelcomeCtrl', function ($scope, $rootScope, $location) {
    $rootScope.formLayout = false;

    $scope.onContinue = function () {
      $location.url('/register')
    };
  });
