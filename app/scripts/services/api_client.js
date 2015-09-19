'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.apiClient
 * @description
 * # apiClient
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
    .service('apiClient', function ($q, api, $rootScope, localStorageService) {
      /**
       * Create Candidate Method
       * @param data
       * @returns {*}
       */
      this.getList = function (id) {
        var payload = {
          id: id
        };
        return api.execute(api.API_CLIENT, ['questions', 'list'], payload);
      };

      this.getUsers = function (payload) {
        return api.execute(api.API_CLIENT, ['answers', 'users'], payload);
      };

      this.getProfile = function (payload) {
        return api.execute(api.API_CLIENT, ['user', 'profile'], payload);
      };

      this.saveUserAndSetToken = function (user) {
        localStorageService.set('user', user);
        api.setToken(user.authToken);
        $rootScope.user = user;
      };

      this.setUser = function () {
        var user =  localStorageService.get('user');
        if (user && user.authToken) {
          api.setToken(user.authToken);
        }
        $rootScope.user = user;
        return user;
      };


      this.logout = function () {
        $rootScope.user = null;
        localStorageService.set('user', null);
      };

      this.finalize = function (id, answers) {
        var payload = {
          answers: answers,
          questionnaireId: id
        };

        return api.execute(api.API_CLIENT, ['answers', 'finalize'], payload);
      };

      this.answersList = function (id, progress) {
        var payload = {
          id: id,
          status: progress
        };

        return api.execute(api.API_CLIENT, ['answers', 'list'], payload);
      };

      this.save = function (id, answers) {
        var payload = {
          answers: answers,
          questionnaireId: id,
          overWrite: true
        };

        return api.execute(api.API_CLIENT, ['answers', 'save'], payload);
      };

      this.register = function (payload) {
        return api.execute(api.API_CLIENT, ['user', 'register'], payload);
      };

      this.login = function (payload) {
        return api.execute(api.API_CLIENT, ['user', 'login'], payload);
      };

      this.getUrl = function (payload) {
        return api.execute(api.API_CLIENT, ['url', 'get'], payload);
      };
    });
