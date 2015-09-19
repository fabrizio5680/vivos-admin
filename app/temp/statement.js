'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:statement
 * @description
 * # statement
 */
angular.module('frontendApp')
  .directive('vStatement', ['hotkeys', '$compile', '$timeout', function (hotkeys, $compile, $timeout) {
        return {
            templateUrl: '/views/directives/statement.html',
            restrict: 'A',
            scope: {
                collection: '=vStatement',
                vModel: '=',
                controllerAction: '&vAction',
                vMultiChoice: '=',
                question: '=vQuestion',
                parentQuestion: '=vParentQuestion',
                postQuestion: '=vPostQuestion',
                okButtonText: '@vOkButtonText'
            },
            link: {
                pre: function (scope, element, attrs) {
                    scope.animate = null;
                    scope.setup = function () {
                     
                        scope.vModel = [true];
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