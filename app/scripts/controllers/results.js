'use strict';

/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('ResultsCtrl', function ($scope, apiClient, $routeParams) {

    var getUrlPath = function () {
      return $routeParams.questionnaireId || null;
    };

    this.start = function () {
      apiClient.setUser();
      apiClient.answersList(getUrlPath(), 'FINAL').then(function (answers) {
        try {
          delete answers.etag;
          delete answers.kind;
          delete answers.result;
          $scope.answers = answers;
        } catch (e) {
          $scope.answers = [];
        }
      });
    };

    this.start();
  });
