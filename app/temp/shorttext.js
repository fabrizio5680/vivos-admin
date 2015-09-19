'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:shorttext
 * @description
 * # shorttext
 */
angular.module('frontendApp')
    .directive('vShortText', ['hotkeys', '$compile', '$timeout', function (hotkeys, $compile, $timeout) {
        return {
            templateUrl: '/views/directives/shorttext.html',
            restrict: 'A',
            scope: {
                collection: '=vShortText',
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

                        scope.vModel = null;
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
