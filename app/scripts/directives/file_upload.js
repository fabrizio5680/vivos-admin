'use strict';

/**
 * @ngdoc directive
 * @name surveyTreeModuleApp.directive:fileUpload
 * @description
 * # fileUpload
 */
angular.module('surveyTreeModuleApp')
  .directive('vFileUpload', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        upload: '=vFileUpload'
      },
      link: function postLink(scope, element) {
        var after = $compile('<div class="pro" ng-bind="progress" ng-class="{ green: progress === \'100%\' }"></div>')(scope);
        element.after(after);
        var successAdded = false;

        var progress = function (n) {
          scope.progress = n + '%';

          if (n === 100 && !successAdded) {
            element.after('<div style="color:green">Successfully uploaded!</div>');
            successAdded = true;
          }
        };

        element.on('change', function () {
          scope.onUploadButtonClick();
        });

        scope.onUploadButtonClick = function () {
          scope.upload(element[0].files[0], progress, element.attr('q-id'));
        }
      }
    };
  });
