if (!console.error) {
  console.error = console.log;
}
'use strict';

/**
 * @ngdoc overview
 * @name surveyTreeModuleApp
 * @description
 * # surveyTreeModuleApp
 *
 * Main module of the application.
 */
angular
    .module('surveyTreeModuleApp', [
      'ngAnimate',
      'ngTouch',
      'ngRoute',
      'LocalStorageModule',
      'angularSpinner',
      'eydis.gapi'
    ])


    .config(function ($gapiProvider, localStorageServiceProvider, $locationProvider, $routeProvider) {
      $gapiProvider.api_base = 'https://api-dot-vivosme.appspot.com/_ah/api';

      localStorageServiceProvider.setPrefix('vivos.admin');

      $routeProvider
          .when('/results/:questionnaireId', {
            templateUrl: 'views/results.html',
            controller: 'ResultsCtrl',
            controllerAs: 'results'
          })
          .when('/candidates', {
            templateUrl: 'views/table.html',
            controller: 'MainCtrl',
            reloadOnSearch: false
          })
          .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'register'
          })
          .when('/welcome', {
            templateUrl: 'views/welcome.html',
            controller: 'WelcomeCtrl',
            controllerAs: 'welcome'
          })
          .when('/profile/:profileId', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'profile'
          })
          .otherwise({
            redirectTo: '/register'
          });
    })


    .run(function ($rootScope, $location, localStorageService, api, usSpinnerService) {

      $rootScope.logout = function () {
        localStorageService.set('user', null);
        $location.url('/register');
        api.setToken(null);
      };


      $rootScope.startSpin = function(){
        usSpinnerService.spin('main');
      };
      $rootScope.stopSpin = function(){
        usSpinnerService.stop('main');
      };


      var init = function () {
        try {
          var user = localStorageService.get('user');
          api.setToken(user.authToken);
        } catch (ignore){
          $location.url('/');
        }

        window.webshims.polyfill();
      };

      init();

    });
