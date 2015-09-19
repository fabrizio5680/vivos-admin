'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:picturechoice
 * @description
 * # picturechoice
 */
angular.module('frontendApp')
    .directive('vPictureChoice', ['hotkeys', '$compile', '$timeout', function (hotkeys, $compile, $timeout) {
        return {
            templateUrl: '/views/directives/picturechoice.html',
            restrict: 'A',
            scope: {
                collection: '=vPictureChoice',
                vModel: '=',
                controllerAction: '&vAction',
                vMultiChoice: '=',
                question: '=vQuestion',
                parentQuestion: '=vParentQuestion',
                postQuestion: '=vPostQuestion',
                okButtonText: '@vOkButtonText',
                noneButtonText: '@vNoneButtonText',
                none: '=vNone',
                allSelected: '=vAllSelected'
            },
            link: {
                pre: function (scope, element, attrs) {
                    scope.animate = null;
                    scope.setup = function () {
                        // bind keys for each form item
                        for (var i = 0; i < scope.collection.length; i++) {
                            var item = scope.collection[i];
                            scope.bindKey(item, i);
                        }
                        
                        // add enter key
                        hotkeys.bindTo(scope).add({
                            combo: 'enter',
                            description: 'Enter',
                            callback: function (e) {
                                scope.onUserEnter(e, scope.vModel);
                            }
                        });

                        // add enter key
                        hotkeys.bindTo(scope).add({
                            combo: 'esc',
                            description: 'Esc',
                            callback: function (e) {
                                scope.onUserNone(e, scope.vModel);
                            }
                        });
                    };

                    scope.bindKey = function (item, i) {
                        var alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
                        item.key = alphabet[i];
                        hotkeys.bindTo(scope).add({
                            combo: alphabet[i],
                            description: item,
                            callback: function (e) {
                                scope.onUserClick(e, item);
                            }
                        });
                    };

                    scope.setup();
                },
                post: function (scope, element, attrs) {



                    scope.onUserClick = function (e, item) {
                        var selection;
                        selection = item;
                        selection.action = e.type;

                        if (scope.vMultiChoice) {
                            if (scope.isActive(item) === -1) {
                                scope.vModel = scope.vModel || [];
                                scope.vModel.push(selection);
                            } else {
                                scope.vModel.splice(scope.isActive(item), 1);
                            }
                        } else {
                            scope.vModel = [];
                            scope.vModel.push(selection);
                        }
                    };

                    scope.onUserEnter = function (e, model) {
                        if (model && model.length > 0) {
                            scope.animate = true;
                            $timeout(function () {
                                scope.controllerAction(e, model);
                            });
                        }
                    };
                    
                    scope.onUserNone = function () {
                        $timeout(function () {
                            scope.controllerAction();
                        });
                    };

                    scope.isActive = function (item) {
                        var i, modelItem;
                        if (!scope.vModel) {
                            return - 1;
                        }

                        for(i = 0; i < scope.vModel.length; i += 1) {
                            modelItem = scope.vModel[i];
                            if (modelItem.$$hashKey === item.$$hashKey) {
                                return i
                            }
                        }
                        return - 1;
                    };
                }
            }
        };
    }]);

