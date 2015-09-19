'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.question
 * @description
 * # question
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('questionService', function (apiClient, $q, $rootScope, utils, $sce, localStorageService) {
    var questionnaire = {};
    questionnaire.length = 0;
    var service = this;
    var answers = {};
    var groups = [];
    var storedVariables = {};
    var lastQuestionId = null;

    // CONSTANTS OPERATOR
    service.MAP = 'MAP_IT';
    // CONSTANTS QUESTION TYPES
    service.QUESTION_GROUP = 'QUESTION_GROUP';
    service.DROP_DOWN = 'DROP_DOWN';
    service.EMAIL = 'EMAIL';
    service.LEGAL = 'LEGAL';
    service.NUMBER = 'NUMBER';
    service.STATEMENT = 'STATEMENT';
    service.MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
    service.PICTURE_CHOICE = 'PICTURE_CHOICE';
    service.SHORT_TEXT = 'SHORT_TEXT';
    service.FILE_UPLOAD = 'FILE_UPLOAD';
    service.LONG_TEXT = 'LONG_TEXT';
    service.WEBSITE = 'WEBSITE';
    service.BOOLEAN = 'BOOLEAN';
    service.RATING = 'RATING';
    service.OPINION_SCALE = 'OPINION_SCALE';
    service.PAYMENT = 'PAYMENT';
    service.RANGE_SLIDER = 'RANGE_SLIDER';
    service.BUTTON_NONE = 'BUTTON_NONE';
    service.BUTTON_OK = 'BUTTON_OK';
    service.DATE_PICKER = 'DATE_PICKER';
    service.PERCENTAGE_SLIDER = 'PERCENTAGE_SLIDER';
    service.CONTINUUM_SLIDER = 'CONTINUUM_SLIDER';
    service.ADDRESS = 'ADDRESS';


    var activeQuestionId = 0;

    service.setAnswersArrayForSaving = function (answers) {
      var as = [];

      var setUp = function (array) {
        var a = [];

        angular.forEach(array, function (item, index) {
          a.push({
            alt: index,
            actual: angular.isArray(item) || angular.isObject(item) ? JSON.stringify(item) : String(item)
          });
        });

        return a;
      };

      angular.forEach(answers, function (ans, key) {
        var answer = null;
        if (ans) {
          answer = angular.copy(ans);
          as.push({
            answers: angular.isArray(answer) ? setUp(answer) : setUp([answer]),
            id: key,
            priority: 1,
            question: key
          });
        }
      });

      return as;
    };

    service.getLength = function () {
      return questionnaire.length;
    };

    service.getFinalizedArray = function () {
      var array = [];
      angular.forEach(answers, function (value, key) {
        array.push(key);
      });

      return array;
    };

    service.getLastQuestionId = function () {
      return lastQuestionId;
    };

    /**
     * Setup
     */
    service.setupQuestionnaireById = function (id) {
      var d = $q.defer();

      if (questionnaire && questionnaire.length > 0) {
        d.resolve(questionnaire);
        return d.promise;
      }

      service.getQuestionnaire(id).then(function (list) {
        setQuestions(list);
        d.resolve(list);
      }, function (error) {
        console.log(error);
        d.reject();
      });

      return d.promise;
    };

    var setQuestions = function (list) {
      angular.forEach(list, function (question) {

        if (question.id) {
          try {
            question.type.attributes = question.type.attributes || {};
            question.type.attributes.ANSWERS = question.type.attributes.ANSWERS || [];
            question.id = parseInt(question.id, 10);
            question.question = $sce.trustAsHtml(question.question);
            question.pretext = $sce.trustAsHtml(question.pretext);
            question.posttext = $sce.trustAsHtml(question.posttext);
            questionnaire[question.id] = question;
            questionnaire[question.id].user = {};
            questionnaire.length += 1;
            groups.push(question.questiongroup || 'Groups to be implemented');
            lastQuestionId = question.id;
          } catch (e) {
            console.error('Issue with question ' + question.id + ', somethings missing??.\n\n\n' + e);
          }
        }
      });
    };

    /**
     * Stores variables used for question linking
     * //output = /[\{]{2}([\w\d_\-]+)[}]{2}/gi;
     * @param answer
     */
    service.searchStoreVariable = function (answer) {
      var input, match;

      if (!answer || !answer.title) {
        return answer;
      }

      // find [[Variable_to-store]]
      input = /[\[]{2}([\w\d_\-]+)[\]]{2}/gi;

      if (answer.title) {
        try {
          match = answer.title.match(input)[0];
          match = match ? match.replace(input, '$1') : null;
        } catch (ignore) {
          match = null;
        }
      }

      try {
        answer.title = answer.title.replace(input, '');
      } catch (ignore) {}

      if (match) {
        storedVariables[match] = answer.title;
      }

      return answer;
    };

    /**
     * Gets variable by key
     * @param variable
     * @returns {*}
     */
    service.getStoreVariable = function (variable) {
      return storedVariables[variable];
    };

    /**
     * Get groups for full questionnaire TODO refactor
     * @returns {jQuery.promise|promise.promise|$gapi.$get.promise|$get.promise|d.promise|promise|*}
     */
    service.getGroups = function () {
      var d = $q.defer();

      $rootScope.$watch(function () {
        return groups;
      }, function (newG, oldG) {
        if (newG !== oldG && newG) {
          d.resolve(newG);
        }
      }, true);

      return d.promise;
    };

    /**
     * Gets questionnaire from API or ...
     * @param id
     * @returns {d.promise}
     */
    service.getQuestionnaire = function (id) {
      var d = $q.defer();
      apiClient.getList(id).then(function (response) {
        d.resolve(response);
      }, function (response) {
        d.reject(response);
        console.log('error', response);
      });

      return d.promise;
    };

    /**
     * Get Current Question by ID
     * @returns {number}
     */
    service.getCurrentQuestionId = function () {
      return activeQuestionId || 2;
    };

    /**
     * Set Current Question by ID
     * @param id
     * @returns {number}
     */
    service.setCurrentQuestionId = function (id) {
      activeQuestionId = id;
      return activeQuestionId;
    };

    /**
     * Get Question By ID
     * @param id
     * @returns {*}
     */
    service.getQuestionById = function (id) {
      id = id || service.getCurrentQuestionId();
      return questionnaire[id];
    };

    /**
     * Answer question∂fwr
     * @param id - question ID
     * @param answer - answer alt
     */
    service.answerQuestion = function (id, answer) {
      questionnaire[id].user = questionnaire[id].user || {};
      questionnaire[id].user.answer = answer;
      localStorageService.set('question_' + (parseInt(id, 10) < 10 ? '0' + id : id), answer);
      answers[id] = answer;
    };

    /**
     * Get Answer by Question id
     * @param id
     * @returns {*}
     */
    service.getAnswerByQuestionId = function (id) {
      questionnaire[id].user = questionnaire[id].user || {};
      return questionnaire[id].user.answer;
    };

    /**
     * Split logical strings
     * @param string
     * @returns {*}
     */
    service.splitLogicString = function (string) {
      try {
        return string && string.length > 0 ? string.replace(/\s/g, '').split(',') : null;
      } catch (ignore) {
        return '';
      }
    };

    /**
     * Creates required key
     * @param requiredQuestionsArray
     * @returns {*}
     */
    service.createRequiredQuestionKey = function (requiredQuestionsArray) {
      requiredQuestionsArray = requiredQuestionsArray || [];
      var requiredAnswersKey = '';

      var id;
      var i;

      for (i = 0; i < requiredQuestionsArray.length; i += 1) {

        id = requiredQuestionsArray[i];

        try {
          requiredAnswersKey = questionnaire[id].user.answer[0].alt;
        } catch (ignore) {}

        if (requiredQuestionsArray[i + 1]) {
          requiredAnswersKey += '-';
        }
      }

      return requiredAnswersKey;
    };

    /**
     * Creates following question key
     * @param followingQuestionsArray
     * @returns {{}}
     */
    service.createFollowingQuestionMap = function (followingQuestionsArray) {
      followingQuestionsArray = followingQuestionsArray || [];
      var followingQuestionsKey = {};
      var next;
      var i;
      for (i = 0; i < followingQuestionsArray.length; i += 1) {
        if (followingQuestionsArray[i]) {
          next = followingQuestionsArray[i].replace(/\s/g, '');
          next = next.split(':');
          followingQuestionsKey[next[0]] = next[1];
        }
      }

      return followingQuestionsKey;
    };
  });
