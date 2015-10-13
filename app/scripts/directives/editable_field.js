'use strict';

/**
 * @ngdoc directive
 * @name surveyTreeModuleApp.directive:editableField
 * @description
 * # editableField
 */
angular.module('surveyTreeModuleApp')
  .directive('editableField', function (candidate) {
    return {
      restrict: 'A',
      scope: true,
      link: function postLink(scope) {
        var undoRating = null;
        scope.editable = false;

        scope.onEdit = function (person) {
          scope.editable = true;
          undoRating = angular.copy(person.generalRating.value);
        };

        scope.onChange = function (person) {
          console.log(person)
        };

        scope.onSave = function (person) {
          candidate.generalRating(person).then(function (p) {
            scope.editable = false;
          });
        };

        scope.onCancel = function (person) {
          person.generalRating.value = undoRating;
          scope.editable = false;
        }
      }
    };
  });
