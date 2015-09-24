/**
 * Created by fabrizio on 16/09/15.
 */
angular.module('surveyTreeModuleApp')
    .directive('vivosValidation', function () {
      return {
        restrict: 'A',
        scope: {
          validate: '=vivosValidation'
        },
        link: function postLink(scope, element) {



          var mapItems = function () {
            var map = {};
            var elements = element.find('[ng-model]');
            angular.forEach(elements, function (el) {

              var id = $(el).attr('ng-model');
              console.log(id);
              if (!id) {
                return;
              }
              try {
                id = id.match(/answers|dates\[(\d*)]/)[1];
              } catch (ignore) {}
              map[id] = {
                id: id,
                type: el.type
              }
            });
            return map;
          };

          scope.validate = function () {
            var items = mapItems();
            return items;
          };
        }
      }
    });

