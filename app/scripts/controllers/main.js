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
                                    $routeParams, $sce, $mdSidenav, apiAdmin, $q, $mdDialog,  profileHandler, candidate) {

    var dateId = 4;
    var offset = 0;
    var limit = 20;
    var questionMap = {};
    var iframe;
    var selectedUser = {};

    var candidateStatus =  candidate.getCandidateStatus();


    var init = function () {

      $scope.toggleLeft = buildToggler('left');
      $scope.toggleRight = buildToggler('right');

      $scope.generalRating = [
        {value: 1, name: 'A'},
        {value: 2, name: 'B'},
        {value: 3, name: 'C'},
        {value: 4, name: 'D'},
        {value: 5, name: 'E'},
        {value: 6, name: 'F'}
      ];

      $scope.persons = [];
      $scope.tableHeaders = [];
      $scope.selected = [];
      $scope.query = {
        filter: '',
        order: 'id',
        limit: 30,
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

      $scope.onGeneralRatingChange = function (person) {
        console.log(person);
      };

      $scope.onPaginationChange = function (page, limit) {
        var d = $q.defer();
        var j = json.splice(0, limit);
        d.resolve(j);
        return d.promise;
      };

      $http.get('/scripts/json/15.json').then(function (questions) {

        angular.forEach(questions.data, function (q) {
          questionMap[q.id] = {
            id: q.id,
            question: q.question
          };
        });

        getCandidates(offset, limit);

      });
    };

    var getCandidates = function (offset, limit) {
      candidate.get(offset, limit).then(function (users) {
        buildCandidates(users);

        if (users.items && users.items.length > 0) {
          offset += limit;
          getCandidates(offset, limit);
        }
        angular.forEach($scope.persons, function (person) {
          angular.forEach(candidateStatus, function (p, id) {
            if (person.id.value === id) {
              person.status.value = p;
            }
          });
        });

      }, function (e) {
        if (e && e.code === 503) {
          localStorageService.set('user', null);
          $location.url('/');
        }
      });
    };


    $scope.onStatusChange = function (status) {
      candidate.changeStatus($scope.selected, status);
    };

    var buildCandidates = function (users) {
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

        $scope.persons.push(candidate.create(qMap));
      });
    };

    var DialogController = function ($scope, $mdDialog) {
      $scope.firstName = selectedUser.firstName.value;
      $scope.iframe = $sce.trustAsHtml(selectedUser.iframe);
      $scope.download = selectedUser.download;

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
        var raw = user.cv.value.value;
      } catch (e) {

      }

      cv = 'https://docs.google.com/gview?url=' + cv + '&embedded=true';
      iframe = '<iframe class="doc" src="' + cv + '"></iframe>';

      selectedUser.iframe = iframe;
      selectedUser.firstName = user.firstName;
      selectedUser.download = raw;

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


    $scope.profile = function (id) {
      $location.url('/profile/' + id);
    };

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    var buildToggler = function (navID) {
      return $mdUtil.debounce(function(){
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $rootScope.$broadcast('toggleOpen');
          });
      },300);
    };


    var getUrlPath = function () {
      return $routeParams.questionnaireId || 15;
    };


    $scope.setDate = function () {
      $scope.answers[dateId] = moment($scope.dates[dateId]).format('DD/MM/YYYY');
    };


    $scope.setProfile = function (profile) {
      profileHandler.setProfile(profile);
    };


    init();

  });