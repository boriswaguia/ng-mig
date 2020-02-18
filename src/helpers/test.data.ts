
import * as path from 'path';
import * as os from 'os';
import { existsSync, copySync, mkdirSync } from '../vendors/helpers/file.helper';
import { BasicModule } from '../services/dependencies/dependent-module.service';
const rimraf = require('rimraf');



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

const mapDataObj = `{
  "ak": {
    "id": "ak",
    "required": [
      "ak.home.ui",
      "ak.navbar.ui",
      "ak.footer.ui",
      "ui.router"
    ],
    "filePath": "/var/folders/dq/fk8v17gd3zgfj44nk1fsy1180000gn/T/ng-mig/DependentModuleImport/src/app/app.module.js"
  },
  "ak.datatypes.text.ui": {
    "id": "ak.datatypes.text.ui",
    "required": [],
    "filePath": "/var/folders/dq/fk8v17gd3zgfj44nk1fsy1180000gn/T/ng-mig/DependentModuleImport/src/app/datatypes/text.ui.module.js"
  },
  "ak.employees.ui": {
    "id": "ak.employees.ui",
    "required": [
      "ui.router",
      "smart-table"
    ],
    "filePath": "/var/folders/dq/fk8v17gd3zgfj44nk1fsy1180000gn/T/ng-mig/DependentModuleImport/src/app/employees/employees.ui.module.js"
  },
  "ak.home.ui": {
    "id": "ak.home.ui",
    "required": [
      "ak.employees.ui",
      "ak.profile.ui",
      "ui.router"
    ],
    "filePath": "/var/folders/dq/fk8v17gd3zgfj44nk1fsy1180000gn/T/ng-mig/DependentModuleImport/src/app/home/home.ui.module.js"
  },
  "ak.profile.ui": {
    "id": "ak.profile.ui",
    "required": [
      "ak.datatypes",
      "ngMessages",
      "ui.router"
    ],
    "filePath": "/var/folders/dq/fk8v17gd3zgfj44nk1fsy1180000gn/T/ng-mig/DependentModuleImport/src/app/profile/profile.ui.module.js"
  }
}`


const moduleExample = `
'use strict';

import * as angular from 'angular';
import { UserService } from './userservice.factory';
import { logger } from './logger.factory';
import { user } from './user.factory';
import { FactoryFunction } from './factoryfunction.factory';
;
var echo = "fd";

angular.module("ak.profile.unusedfunc", []).factory("FactoryFunction", FactoryFunction).factory('user', user).factory('logger', logger).factory('UserService', UserService);

function unusedFunction(arg) {
  return this;
}

function secondUnusedFunction(ars) {
  console.log('should remain in the module');
}

class User {}

;
`;

const mapData = (): Map<string, BasicModule> => {
  const result = new Map<string, BasicModule>();
  const raw = JSON.parse(mapDataObj)
  Object.keys(raw).forEach(id => {
    result.set(id, raw[id]);
  });
  return result;
}


export { source, createTestData, deleteTestData, mapData, moduleExample };
