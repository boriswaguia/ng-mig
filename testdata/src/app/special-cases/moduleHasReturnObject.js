(function() {
    "use strict";
  
    angular
      .module("ak.profile.returnobj", [])
      .directive("myDirectiveRequired", myDirectiveRequired);
  
    function myDirectiveRequired() {
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
  })();
  