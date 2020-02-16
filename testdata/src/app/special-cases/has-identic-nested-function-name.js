(function() {
  "use strict";

  angular
    .module("ak.profile.identic.nexted.func", ["ak.datatypes", "ngMessages", "ui.router"])
    .controller("NestedController", NestedController);

  function NestedController(args) {
    function NestedController (arg1, arg2, arg3) {
    }
    return NestedController;
  }
})();
