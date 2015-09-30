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

    var service = this;

    String.prototype.toCamelCase = function(str) {
      return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
    };

    (function() {
      // utility functions
      var default_cmp = function(a, b) {
          if (a == b) return 0;
          return a < b ? -1 : 1;
        },
        getCmpFunc = function(primer, reverse) {
          var cmp = default_cmp;
          if (primer) {
            cmp = function(a, b) {
              return default_cmp(primer(a), primer(b));
            };
          }
          if (reverse) {
            return function(a, b) {
              return -1 * cmp(a, b);
            };
          }
          return cmp;
        };

      // actual implementation
      service.sortBy = function() {
        var fields = [],
          n_fields = arguments.length,
          field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
          field = arguments[i];
          if (typeof field === 'string') {
            name = field;
            cmp = default_cmp;
          }
          else {
            name = field.name;
            cmp = getCmpFunc(field.primer, field.reverse);
          }
          fields.push({
            name: name,
            cmp: cmp
          });
        }

        return function(A, B) {
          var a, b, name, cmp, result;
          for (var i = 0, l = n_fields; i < l; i++) {
            result = 0;
            field = fields[i];
            name = field.name;
            cmp = field.cmp;

            result = cmp(A[name], B[name]);
            if (result !== 0) break;
          }
          return result;
        }
      }
    }());

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
