'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.candidate
 * @description
 * # candidate
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('candidate', function (localStorageService, apiAdmin, $q) {

    var candidateStatus = {};


    this.create = function (qMap) {
      return {
        cv: {id: 'cv', value: qMap[34], special: true },
        vRating: {value: 0, id: 'vRating'},
        firstName: qMap[2],
        familyName: qMap[3],
        status: {value: 'pending'},
        generalRating: {value: qMap.rating || 6, id: 'generalRating', tableIgnore: true},
        suitabilityRating: {value: 0, id: 'suitabilityRating', tableIgnore: true},
        articleship: qMap[23],
        accountancyQualificationYear: qMap[12],
        departments: qMap[25],
        accountancyQualificationAttempts: qMap[13],
        educationHighSchool: qMap[38],
        educationDegree: qMap[17],
        performanceRating: qMap[26],
        primaryClients: qMap[24],
        dob: qMap[4],
        id: {id: 'id', value: qMap.id, special: true },
        profile: { id: 'profile', value: qMap, special: true }
      }
    };

    this.generalRating = function (person) {
      var d = $q.defer();
      apiAdmin.generalRating({questionnaireId: 15, rating: person.generalRating.value, userId: person.id.value}).then(function (p) {
        d.resolve(p);
      });
      return d.promise;
    };

    this.getById = function (candidates, id) {
      var candidate = null;
      candidates.map(function (c) {
        candidate = c && c.id ? (parseInt(c.id, 10) === parseInt(id, 10) ? c : null) : null;
      });

      return candidate;
    };

    this.get = function (offset, limit) {
      var d = $q.defer();

      apiAdmin.getUsers({id:15, limit: limit, offset: offset}).then(function (users) {
        d.resolve(users);
      });

      return d.promise;
    };


    this.changeStatus = function (candidates, status) {
      candidateStatus = candidateStatus || {};
      angular.forEach(candidates, function (person) {
        person.status.value = status;
        candidateStatus[person.id.value] = status;
      });

      localStorageService.set('personStatus', candidateStatus);
    };

    this.getCandidateStatus = function () {
      return localStorageService.get('personStatus') || candidateStatus;
    };

  });
