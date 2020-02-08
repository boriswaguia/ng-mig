import { hasModule, extractModuleDeclaration } from './module.service';
describe("ModuleService", () => {
  const ANGULAR_JS_MODULE = 'angular';
    const source = `(function () {
      'use strict';

      angular
          .module('ak', [
              'ak.home.ui',
              'ak.navbar.ui',
              'ak.footer.ui',
              'ui.router'
          ])
          .config(route);


      function route($urlRouterProvider, $stateProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider
              .state('ak', {
                  abstract: true,
                  url: '',
                  templateUrl: 'app/app.html',
                  views: {
                      'header': {
                          template: '<ak-navbar></ak-navbar>'
                      },
                      'footer': {
                          template: '<ak-footer></ak-footer>'
                      }
                  }
              });
      }
    })();

    `;


  test('should have module', (done) => {

    const result = hasModule(source, ANGULAR_JS_MODULE);
    result.subscribe(r => {
      expect(r).toBeTruthy();
      done();
    })
  });

  test('should extract existing module', (done) => {
    const result = extractModuleDeclaration(source);
    result.subscribe(r => {
      expect(result).toBeTruthy();
      done();
    })
  });

});
