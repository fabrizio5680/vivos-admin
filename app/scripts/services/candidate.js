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
    var persons = [];

    var getLastRating = function (qMap) {
      var ratings = qMap.ratings;
      if (ratings && ratings[ratings.length - 1]) {
        return ratings[ratings.length - 1].rating;
      }
      return 'unrated';
    };

    var getLastComment = function (qMap) {
      var comments = qMap.comments;
      if (comments && comments[comments.length - 1]) {
        return comments[comments.length - 1].rating;
      }
      return 'unrated';
    };

    this.create = function (qMap) {
      return {
        cv: {id: 'cv', value: qMap[34], special: true },
        vRating: {value: 0, id: 'vRating'},
        firstName: qMap[2],
        familyName: qMap[3],
        email:{ id: 'email', value: qMap.email },
        registered: {id: 'registered', value: qMap[1000] ? qMap[1000][0] : null},
        status: {value: 'pending'},
        generalRating: {value: getLastRating(qMap), id: 'generalRating', tableIgnore: true},
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
      };
    };

    this.addToPersons = function (person) {
      persons.push(person);
    };

    this.getPersons = function () {
      return persons;
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
      }, function (e) {
        d.reject(e);
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
