'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.profile
 * @description
 * # profile
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('profileHandler', function (apiAdmin) {
    var profile;

    this.comment = null;

    this.setProfile = function (p) {
      profile = p;
    };

    this.getProfile = function () {
      return profile;
    };
  });
