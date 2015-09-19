'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.templates
 * @description
 * # templates
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('templates', function ($templateCache, $http, $q, questionService) {

    var templates = {
      DROP_DOWN: { url: '/views/directives/dropdown.html', name: questionService.DROP_DOWN },
      LONG_TEXT: { url: '/views/directives/longtext.html', name: questionService.LONG_TEXT },
      MULTIPLE_CHOICE: { url: '/views/directives/multiplechoice.html', name: questionService.MULTIPLE_CHOICE },
      BUTTON_NONE: { url: '/views/directives/nonebutton.html', name: questionService.BUTTON_NONE },
      NUMBER: { url: '/views/directives/number.html', name: questionService.NUMBER },
      BUTTON_OK: { url: '/views/directives/okbutton.html', name: questionService.BUTTON_OK },
      PICTURE_CHOICE: { url: '/views/directives/picturechoice.html', name: questionService.PICTURE_CHOICE },
      SHORT_TEXT: { url: '/views/directives/shorttext.html', name: questionService.SHORT_TEXT },
      EMAIL: { url: '/views/directives/email.html', name: questionService.EMAIL },
      WEBSITE: { url: '/views/directives/website.html', name: questionService.WEBSITE },
      STATEMENT: { url: '/views/directives/statement.html', name: questionService.STATEMENT },
      BOOLEAN: { url: '/views/directives/yesno.html', name: questionService.BOOLEAN },
      RANGE_SLIDER: { url: '/views/directives/number.html', name: questionService.RANGE_SLIDER }, //change to slider TODO
      DATE_PICKER: { url: '/views/directives/number.html', name: questionService.DATE_PICKER }, //change to slider TODO
      PERCENTAGE_SLIDER: { url: '/views/directives/number.html', name: questionService.PERCENTAGE_SLIDER }, //change to slider TODO
      CONTINUUM_SLIDER: { url: '/views/directives/number.html', name: questionService.CONTINUUM_SLIDER }, //change to slider TODO
      FILE_UPLOAD: { url: '/views/directives/website.html', name: questionService.FILE_UPLOAD }
    };

    var retrieveAndSetTemplate = function (name, url) {
      var d = $q.defer();

      $http.get(url).then(function (response) {
        templates[name].data = response.data;
        $templateCache.put(name, response.data);
        d.resolve(templates[name]);
      }, function (error) {
        d.reject(error);
      });

      return d.promise;
    };

    var getTemplateByName = function (name) {

      var d = $q.defer();
      if (templates[name] && templates[name].data) {
        d.resolve(templates[name]);
        return d.promise;
      }
      var temp = null;
      try {
        temp = templates[name].url;
        retrieveAndSetTemplate(name, temp).then(function () {
          d.resolve(templates[name]);
        });
      } catch (e) {
        if (name) {
          console.error('QUESTION TYPE ' + name + ' NOT SUPPORTED.. \n\n' +
          'Could not find: ' + name +
          '\n\nSpecify supported Question Type in Spreadsheet/JSON' +
          '\n\n' + 'Exception: ' + e);
        } else {
          console.error('QUESTION TYPE NOT SUPPORTED.. \n\n' +
          'Please check question type in spreadsheet is a supported question type' +
          '\n\n' + 'Exception: ' + e);
        }
        temp = templates[questionService.STATEMENT].url;
        retrieveAndSetTemplate(questionService.STATEMENT, temp).then(function () {
          d.resolve(templates[questionService.STATEMENT]);
        });

      }
      return d.promise;
    };

    var getAndCacheStoreTemplates = function (templates) {
      angular.forEach(templates, function (template) {
        retrieveAndSetTemplate(template.name, template.url);
      });
    };

    this.getTemplateByName = getTemplateByName;

    getAndCacheStoreTemplates(templates);
  });
