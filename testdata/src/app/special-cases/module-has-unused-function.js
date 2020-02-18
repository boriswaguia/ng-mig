(function() {
  "use strict";

  var echo = "fd";

  angular
    .module("ak.profile.unusedfunc", [])
    .factory("FactoryFunction", FactoryFunction)
    .factory('user', {
      name: 'FirstName'
    })
    .factory('logger', function(arg) {
      return {
        arg
      }
    })
    .factory('UserService', UserService);

  function unusedFunction(arg) {
    return this;
  }

  function secondUnusedFunction(ars) {
    console.log('should remain in the module');
  }

  function FactoryFunction($stateProvider, $location) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elemt, attrs, ctrl) {
            ctrl.$vakudatirs.uiSelectRequired = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                return !!value.length;
            }
        }
    }
  }
  class UserService {
    constructor(name) {
      this.user = new User();
    }
  }
  class User {}
})();
