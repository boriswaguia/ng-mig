(function () {
    'use strict';

    angular
        .module('ak.footer.ui', [])
        .component('akFooter', {
            templateUrl: 'app/footer/footer.html'
        });

    function testFunction() {
      const b = function() {
        var akFooter = 'adbs';
        return {akFooter};
      }
    }
})();
