'use strict';

describe('Controller: ModalFormCtrl', function () {

  // load the controller's module
  beforeEach(module('surveyTreeModuleApp'));

  var ModalFormCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalFormCtrl = $controller('ModalFormCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ModalFormCtrl.awesomeThings.length).toBe(3);
  });
});
