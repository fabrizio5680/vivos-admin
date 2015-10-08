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
  .controller('MainCtrl', function ($scope, $rootScope, $http, $timeout, localStorageService, utils, $location, $mdUtil,
                                    $routeParams, $sce, $mdSidenav, apiAdmin, $q, $mdDialog,  profileHandler, apiClient) {

    var dateId = 4;

    var iframe;
    var selectedUser = {};

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
            $rootScope.$broadcast('toggleOpen');
          });
      },300);
      return debounceFn;
    }

    $scope.setProfile = function (profile) {
      profileHandler.setProfile(profile);
    };


    var init = function () {
      $scope.persons = [];
      $scope.tableHeaders = [];
      $scope.selected = [];
      $scope.query = {
        filter: '',
        order: 'id',
        limit: 100,
        page: 1
      };

      $scope.columns = [{
        name: 'Profile'
      }, {
        name: 'CV'
      }, {
        name: 'Vivos % Rating',
        orderBy: 'vRating.value'
      }, {
        name: 'First Name',
        orderBy: 'firstName.value'
      }, {
        name: 'Family Name',
        orderBy: 'familyName.value'
      }, {
        name: 'Status',
        orderBy: 'status.value'
      }, {
        name: 'General Rating',
        orderBy: 'generalRating.value'
      }, {
        name: 'Suitability Rating',
        orderBy: 'suitabilityRating.value'
      }, {
        name: 'Articleship',
        orderBy: 'articleship.value'
      }, {
        name: 'Accountancy Qualification (Year)',
        orderBy: 'accountancyQualificationYear.value'
      }, {
        name: 'Department',
        orderBy: 'departments.value'
      }, {
        name: 'Accountancy Qualification (Attempts)',
        orderBy: 'accountancyQualificationAttempts.value'
      }, {
        name: 'Education High School',
        orderBy: 'educationHighSchool.value'
      }, {
        name: 'Education Degree',
        orderBy: 'educationDegree.value'
      }, {
        name: 'Performance Rating',
        orderBy: 'performanceRating.value'
      }, {
        name: 'Primary Clients',
        orderBy: 'primaryClients.value'
      }, {
        name: 'Date of Birth',
        orderBy: 'dob.value'
      }];

      // in the future we may see a few built in alternate headers but in the mean time
      // you can implement your own search header and do something like
      $scope.search = function (predicate) {
        $scope.filter = predicate;
      };

      $scope.onOrderChange = function () {
        var d = $q.defer();
        d.resolve(json);
        return d.promise;
      };

      $scope.onPaginationChange = function (page, limit) {
        var d = $q.defer();
        var j = json.splice(0, limit);
        d.resolve(j);
        return d.promise;
      };

      $http.get('/scripts/json/15.json').then(function (questions) {
        var questionMap = {};

        angular.forEach(questions.data, function (q) {

          questionMap[q.id] = {
            id: q.id,
            question: q.question
          };
        });



        apiAdmin.getUsers({id:15, limit: 999}).then(function (users) {

          angular.forEach(users.items, function (item) {
            var qMap = angular.copy(questionMap);

            angular.forEach(item, function (itm, key) {
              try {
                if (key === '5' || key === '39') {
                  itm[0] = JSON.parse(itm[0]);
                  qMap[key].value = itm[0];
                } else {
                  qMap[key].value = itm[0];
                }
              } catch (e) {
                qMap[key] = itm;
              }
            });

            $scope.persons.push(personFactory(qMap));
          });

        });
      });
    };

    var DialogController = function ($scope, $mdDialog) {
      $scope.firstName = selectedUser.firstName.value;
      $scope.iframe = $sce.trustAsHtml(selectedUser.iframe);

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.print = function () {
        window.print();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    };

    $scope.showCV = function (ev, user) {
      try {
        var cv = user.cv.value.value;
      } catch (e) {

      }

      cv = 'https://docs.google.com/gview?url=' + cv + '&embedded=true';
      iframe = '<iframe class="doc" src="' + cv + '"></iframe>';

      selectedUser.iframe = iframe;
      selectedUser.firstName = user.firstName;

      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/views/templates/doc-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    var personFactory = function (qMap) {
      return {
        cv: {id: 'cv', value: qMap[34] },
        vRating: {value: 0, id: 'vRating'},
        firstName: qMap[2],
        familyName: qMap[3],
        status: {value: 'pending'},
        generalRating: {value: 0, id: 'generalRating' },
        suitabilityRating: {value: 0, id: 'suitabilityRating' },
        articleship: qMap[23],
        accountancyQualificationYear: qMap[12],
        departments: qMap[25],
        accountancyQualificationAttempts: qMap[13],
        educationHighSchool: qMap[38],
        educationDegree: qMap[17],
        performanceRating: qMap[26],
        primaryClients: qMap[24],
        dob: qMap[4],
        id: {id: 'id', value: qMap.id },
        profile: { id: 'profile', value: qMap }
      }
    };


    $scope.profile = function (id) {
      $location.url('/profile/' + id);
    };


    init();

  });