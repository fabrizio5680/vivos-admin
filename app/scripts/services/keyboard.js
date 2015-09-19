'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.keyboard
 * @description
 * # keyboard
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('keyboard', function ($rootScope, $timeout, hotkeys) {

    var self = this;
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    this.alphabet = alphabet.split('');

    this.ENTER = 'keyboard.enter';
    this.ESC = 'keyboard.esc';
    this.KEY = 'keyboard.key';

    this.setup = function () {
      // add enter key
      hotkeys.bindTo($rootScope).add({
        combo: 'enter',
        description: 'Enter',
        callback: function () {
          $timeout(function () {
            $rootScope.$broadcast(self.ENTER, self.ENTER);
          });
        }
      });

      // add esc key
      hotkeys.bindTo($rootScope).add({
        combo: 'esc',
        description: 'Esc',
        callback: function () {
          $timeout(function () {
            $rootScope.$broadcast(self.ESC, self.ESC);
          });
        }
      });

      angular.forEach(this.alphabet, function (letter) {
        hotkeys.bindTo($rootScope).add({
          combo: letter,
          description: letter,
          callback: function () {
            $timeout(function () {
              $rootScope.$broadcast(self.KEY, letter);
            });
          }
        });
      });
    };

    this.setup();


  });
