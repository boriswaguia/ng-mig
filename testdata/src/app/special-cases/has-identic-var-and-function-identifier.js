(function() {
  "use strict";

  angular
    .module("ak.profile.ui", ["ak.datatypes", "ngMessages", "ui.router"])
    .controller("ProfileController", ProfileController);

  function ProfileController() {
    var ProfileController = this;

    _.extend(ProfileController, {
      change: function() {
        // Implementation
      }
    });
  }
})();
