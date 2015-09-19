'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:number
 * @description
 * # number
 */
angular.module('frontendApp')
    .directive('vNumberChoice', ['hotkeys', '$compile', '$timeout', function (hotkeys, $compile, $timeout) {
        return {
            templateUrl: '/views/directives/number.html',
            restrict: 'A',
            scope: {
                collection: '=vNumberChoice',
                vModel: '=',
                controllerAction: '&vAction',
                vMultiChoice: '=',
                question: '=vQuestion',
                parentQuestion: '=vParentQuestion',
                okButtonText: '@vOkButtonText',
                noneButtonText: '@vNoneButtonText',
                none: '=vNone',
                money: '=vCurrency'
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
                        try {
                        scope.money = JSON.parse(scope.money);
                        } catch (e) {
                            console.log('error parsing currency JSON for number directive');
                        }
                    };
                  
                    scope.setup();
                },
                post: function (scope, element, attrs) {

                    scope.onNumberChange = function () {
                        
                    };

                    scope.onUserEnter = function (e, model) {
                        if (model > -1) {
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
