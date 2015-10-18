'use strict';

describe('Filter: tableFilter', function () {

  // load the filter's module
  beforeEach(module('surveyTreeModuleApp'));

  // initialize a new instance of the filter before each test
  var tableFilter;
  beforeEach(inject(function ($filter) {
    tableFilter = $filter('tableFilter');
  }));

  it('should return the input prefixed with "tableFilter filter:"', function () {
    var text = 'angularjs';
    expect(tableFilter(text)).toBe('tableFilter filter: ' + text);
  });

});
