'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:multiplechoice
 * @description
 * # multiplechoice
 */
angular.module('frontendApp')
    .directive('vMultiSlider', ['hotkeys', '$timeout', '$compile', function (hotkeys, $timeout, $compile) {
      return {
        templateUrl: '/views/directives/slider.html',
        restrict: 'A',
        scope: {
          collection: '=vMultiSlider',
          vModel: '=',
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

            scope.onUserEnter = function (e, model) {
              if (model && model.length > 0) {
                scope.animate = true;
                $timeout(function () {
                  scope.controllerAction(e, model);
                });
              }
            };
          }
        }
      };
    }]);
