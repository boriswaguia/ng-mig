(function() {
  "use strict";

  angular
    .module("ak.profile.returnobj", [])
    .directive("funcArgImmediateReturnObjsReturn", function($rootScope, scopeVars, appendTo){
      return {
        showWithTemplate: function(templateUrl, scopeVwars, appendTo) {
          var dialog = {};
          return dialog;
        }
      }
    });

})();
