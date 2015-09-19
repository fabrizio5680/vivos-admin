'use strict';

/**
 * @ngdoc service
 * @name surveyTreeModuleApp.utils
 * @description
 * # utils
 * Service in the surveyTreeModuleApp.
 */
angular.module('surveyTreeModuleApp')
  .service('utils', function () {

    var indexOf = function (arr, val) {
      return arr.indexOf(val) > -1;
    };

    var indexOfPoly = function (arr, val) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === val) {
          return true;
        }
      }
      return false;
    };

    var arrayContains = Array.prototype.indexOf ? indexOf : indexOfPoly;


    this.syntaxHighlight = function (json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    };

    /**
     * Removes duplicate strings in Array
     * @param arr
     * @returns {*}
     */
    this.removeDuplicates = function (arr) {
      var val, i, len, originalArr = arr.slice(0);
      arr.length = 0;

      for (i = 0, len = originalArr.length; i < len; i += 1) {
        val = originalArr[i];
        if (!arrayContains(arr, val)) {
          arr.push(val);
        }
      }

      return arr;
    };
  });
