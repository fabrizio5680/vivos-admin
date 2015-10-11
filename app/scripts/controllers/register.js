'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('RegisterCtrl', function ($scope, $rootScope, $location, apiAdmin, apiClient, localStorageService) {

    var self = this;
    $scope.user = {};
    $scope.toRegister = false;
    $rootScope.formLayout = false;

    this.init = function () {
      var user = apiClient.setUser();
      if (user && user.authToken) {
        this.redirect();
        $scope.toRegister = false;
      } else {
        $scope.toRegister = true;
      }
    };

    this.redirect = function () {
      $rootScope.formLayout = true;
      $location.url('/candidates');
    };


    $scope.createSession = function () {

      var payload = {
        email: this.user.email,
        password: this.user.password,
        name: 'vivos.user'
      };

      $scope.startSpin();

      apiClient.register(payload).then(function (response) {
        if (response && response.authToken) {
          apiClient.saveUserAndSetToken(response);
          self.redirect();
        }

        if (response.error && response.code === 400) {
          $scope.message = 'Email address might be already in use - please try again';
        }

        localStorageService.set('user.email', response.email);

        $scope.stopSpin();
      }, function (error) {
        try {
          $scope.error = JSON.parse(error);
        } catch (e) {
          $scope.error = error;
        }
        $scope.stopSpin();
      });
    };

    $scope.setSession = function () {

      var payload = {
        email: this.user.email,
        password: this.user.password
      };

      apiAdmin.login(payload).then(function (response) {
        if (response && response.authToken) {
          apiClient.saveUserAndSetToken(response);
          self.redirect();
        }
      });
    };


    this.init();
  });
