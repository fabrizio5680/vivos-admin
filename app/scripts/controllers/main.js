'use strict';
var json;
/**
 * @ngdoc function
 * @name surveyTreeModuleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the surveyTreeModuleApp
 */
angular.module('surveyTreeModuleApp')
  .controller('MainCtrl', function ($scope, $rootScope, $timeout, localStorageService, utils, $location, $mdUtil,
                                    $routeParams, $sce, $mdSidenav, apiClient, DTOptionsBuilder, DTColumnDefBuilder, $q) {



    var dateId = 4;
    var getUrlPath = function () {
      return $routeParams.questionnaireId || 15;
    };


    $scope.setDate = function () {
      $scope.answers[dateId] = moment($scope.dates[dateId]).format('DD/MM/YYYY');
    };

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      },300);
      return debounceFn;
    }

    /**
     * Setup of Controller
     */
    var getUsers = function () {
      var d = $q.defer();

      apiClient.getUsers({id:15}).then(function (response) {

        var array = [];
        angular.forEach(response.items, function(item) {
          var obj = {};
          angular.forEach(item, function (value, key) {
            delete value.kind;
            delete value.etag;
            if (parseFloat(key) > 4){
              return;
            }
            obj['column_' + key] = value[0];
          });
          array.push(obj);
        });

        d.resolve(array);
      });

      return d.promise;
    };

    var init = function () {

      getUsers().then(function (array) {
        $scope.persons = array;
      });

      $scope.dtOptions = DTOptionsBuilder.newOptions().withOption({bFilter: false}).withPaginationType('full_numbers').withDisplayLength(2);
      $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        //DTColumnDefBuilder.newColumnDef(2).notSortable()
      ];

    };

    $scope.profile = function (id) {
      $location.url('/profile/' + id);
    };


    init();

  });
