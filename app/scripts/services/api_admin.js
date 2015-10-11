'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.apiClient
 * @description
 * # apiClient
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('apiAdmin', function ($q, api) {
    /**
     * Create Candidate Method
     * @param data
     * @returns {*}
     */
    this.getUsers = function (payload) {
      return api.execute(api.API_ADMIN, ['answers', 'users'], payload);
    };

    this.login = function (payload) {
      return api.execute(api.API_ADMIN, ['user', 'login'], payload);
    };


  });