
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';
import { existsSync, copySync, mkdirSync } from '../vendors/helpers/file.helper';
const rimraf = require('rimraf');



const source: string = `(function () {
  'use strict';

  var EMPLOYEES = [
      {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
      {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
      {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
  ]

  angular
      .module('ak.employees.ui', [
          'ui.router',
          'smart-table'
      ])
      .config(route)
      .constant('EMPLOYEES', EMPLOYEES)
      .controller('EmployeesController', EmployeesController);

  function route($stateProvider) {
      $stateProvider
          .state('ak.employees', {
              url: '/employees',
              views: {
                  'content@': {
                      templateUrl: 'app/employees/employees.html',
                      controller: 'EmployeesController',
                      controllerAs: 'vm'
                  }
              }
          });
  }

  function EmployeesController(EMPLOYEES) {
      var vm = this;

      _.extend(vm, {
          employees: EMPLOYEES
      });
  }
})();
`;


const createTestData = (testName: string) => {
  const tmpDir = path.join(os.tmpdir(), 'ng-mig', testName);
  mkdirSync(tmpDir);
  console.log('tmpdir', tmpDir);
  copySync('testdata/', tmpDir);
  return tmpDir;
};



const deleteTestData = (testName: string) => {
  const dir = path.join(os.tmpdir(), 'ng-mig', testName);
    rimraf.sync(dir);
    expect(existsSync(dir)).toBeFalsy();
}

export { source, createTestData, deleteTestData };
