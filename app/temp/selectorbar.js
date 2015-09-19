'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:selectorbar
 * @description
 * # selectorbar
 */
angular.module('frontendApp')
    .directive('sliderBar', function () {
        return {
            restrict: 'E',
            link: {
                pre: function (scope, element, attrs) {
                    var i = 0;
                    var dragging = false;
                    
                    
                    angular.element(element).mousedown(function(e){
                        e.preventDefault();

                        dragging = true;
                        var main = $('#main');

                        angular.element(document).mousemove(function(e){
                            angular.element(element).css("left", e.pageX + 2);
                        });
                    });

                    angular.element(document).mouseup(function(e){
                        if (dragging)
                        {
                            angular.element(document).css("width",e.pageX + 2);
                            $('#main').css("left",e.pageX+2);
                            $('#ghostbar').remove();
                            $(document).unbind('mousemove');
                            dragging = false;
                        }
                    });

                },
                pos: function (scope, element, attrs) {

                }
            }
        };
    });
