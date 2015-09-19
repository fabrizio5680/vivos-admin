'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:dropdown
 * @description
 * # dropdown
 */
angular.module('frontendApp')
  .directive('vDropDown', ['hotkeys', '$compile', '$timeout', function (hotkeys, $compile, $timeout) {
    return {
      templateUrl: '/views/directives/dropdown.html',
      restrict: 'A',
      scope: {
        collection: '=vDropDown',
        vModel: '=',
        vPlaceholder: '=',
        controllerAction: '&vAction',
        vMultiChoice: '=',
        question: '=vQuestion',
        parentQuestion: '=vParentQuestion',
        okButtonText: '@vOkButtonText'

      },
      link: {
        pre: function (scope, element, attrs) {
          scope.animate = null;
          scope.setup = function () {
            // add enter key
            hotkeys.bindTo(scope).add({
              combo: 'enter',
              description: 'Enter',
              callback: function (e) {
                scope.onUserEnter(e, scope.vModel);
              }
            });

          };

          scope.setup();
        },
        post: function (scope, element, attrs) {

          scope.$on(scope.vModel, function (newModel, oldModel) {
            if (newModel != oldModel) {
              scope.onUserEnter()
            }
          }, true);
          scope.onNumberChange = function () {

          };

          scope.onUserEnter = function (e, model) {
            if (model) {
              scope.animate = true;
              $timeout(function () {
                scope.controllerAction(e, model);
              });
            }
          };

          scope.$watch('vModel', function (newV, oldV) {
            if (newV !== oldV) {

            }
          });

        }
      }
    };
  }]);
