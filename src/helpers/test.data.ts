
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
import { DummyService } from './dummyservice.service'
;
var echo = "fd";

angular.module("ak.profile.unusedfunc", [])
  .factory("FactoryFunction", FactoryFunction)
  .factory('user', user)
  .factory('logger', logger)
  .factory('UserService', UserService)
  .factory('DummyService', DummyService);

function unusedFunction(arg) {
  return this;
}

function secondUnusedFunction(ars) {
  console.log('should remain in the module');
}

class User {}

;
`;


const factoryFunctionFile = `
function FactoryFunction($stateProvider, $location) {
  const FactoryFunction = this;
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
`;


const serviceClassFile = `
'use strict';

import _ from 'lodash';
class UserService {
  constructor(ServiceA, $http) {
    this.user = new User();
  }

  getname(name) {
    return 'dummy-'+name;
  }

  multipy(a, b) {
    return a * b;
  }
 };

 export { UserService };

`

const serviceWithVariableDeclaration = `
 'use strict';
 const DummyService = function($stateProvdier, ServiceA) {
   const DummyService = this;
   console.log('$stateProvdier', $stateProvdier);
 }

 export { DummyService };
`;

const moduleImportDeclarationJson = `[{"source":{"type":"StringLiteral","start":80,"end":103,"loc":{"start":{"line":5,"column":28},"end":{"line":5,"column":51}},"extra":{"rawValue":"./userservice.factory","raw":"'./userservice.factory'"},"value":"./userservice.factory"},"specifier":{"type":"ImportSpecifier","start":61,"end":72,"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":20}},"imported":{"type":"Identifier","start":61,"end":72,"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":20},"identifierName":"UserService"},"name":"UserService"},"local":{"type":"Identifier","start":61,"end":72,"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":20},"identifierName":"UserService"},"name":"UserService"}}},{"source":{"type":"StringLiteral","start":128,"end":146,"loc":{"start":{"line":6,"column":23},"end":{"line":6,"column":41}},"extra":{"rawValue":"./logger.factory","raw":"'./logger.factory'"},"value":"./logger.factory"},"specifier":{"type":"ImportSpecifier","start":114,"end":120,"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":15}},"imported":{"type":"Identifier","start":114,"end":120,"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":15},"identifierName":"logger"},"name":"logger"},"local":{"type":"Identifier","start":114,"end":120,"loc":{"start":{"line":6,"column":9},"end":{"line":6,"column":15},"identifierName":"logger"},"name":"logger"}}},{"source":{"type":"StringLiteral","start":169,"end":185,"loc":{"start":{"line":7,"column":21},"end":{"line":7,"column":37}},"extra":{"rawValue":"./user.factory","raw":"'./user.factory'"},"value":"./user.factory"},"specifier":{"type":"ImportSpecifier","start":157,"end":161,"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":13}},"imported":{"type":"Identifier","start":157,"end":161,"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":13},"identifierName":"user"},"name":"user"},"local":{"type":"Identifier","start":157,"end":161,"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":13},"identifierName":"user"},"name":"user"}}},{"source":{"type":"StringLiteral","start":219,"end":246,"loc":{"start":{"line":8,"column":32},"end":{"line":8,"column":59}},"extra":{"rawValue":"./factoryfunction.factory","raw":"'./factoryfunction.factory'"},"value":"./factoryfunction.factory"},"specifier":{"type":"ImportSpecifier","start":196,"end":211,"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":24}},"imported":{"type":"Identifier","start":196,"end":211,"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":24},"identifierName":"FactoryFunction"},"name":"FactoryFunction"},"local":{"type":"Identifier","start":196,"end":211,"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":24},"identifierName":"FactoryFunction"},"name":"FactoryFunction"}}},{"source":{"type":"StringLiteral","start":277,"end":301,"loc":{"start":{"line":9,"column":29},"end":{"line":9,"column":53}},"extra":{"rawValue":"./dummyservice.service","raw":"'./dummyservice.service'"},"value":"./dummyservice.service"},"specifier":{"type":"ImportSpecifier","start":257,"end":269,"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":21}},"imported":{"type":"Identifier","start":257,"end":269,"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":21},"identifierName":"DummyService"},"name":"DummyService"},"local":{"type":"Identifier","start":257,"end":269,"loc":{"start":{"line":9,"column":9},"end":{"line":9,"column":21},"identifierName":"DummyService"},"name":"DummyService"}}}]`;


const exampleFunction = `
'use strict';
import _ from 'lodash';

function UserController($location, UserService, USER_URL_ENDPOINT_CONST) {
  let vm = this;
  let count;
  let count2 = this.getNumber();
  vm.count3 = this.getNumber()+count2;

  _.extend(vm, {
    loading: true,
    messages: []
  });

  loadUsers();

  function loadUsers() {
    const xyz = 123;
    if(!vm.loading) {
      vm.loading = true;
      UserService.loadUsers(USER_URL_ENDPOINT_CONST);
      vm.loading = false;
    } else {
      console.log('an operation already ongoing');
    }
  }
}
export { UserController };
`;

const expectedClass = `'use strict';

import _ from 'lodash';

class UserController {
  constructor($location, UserService, USER_URL_ENDPOINT_CONST) {
    this.vm = this;
    this.count = null;
    this.count2 = this.getNumber();
    vm.count3 = this.getNumber() + count2;

    _.extend(vm, {
      loading: true,
      messages: []
    });

    loadUsers();
  }

  loadUsers() {
    const xyz = 123;

    if (!vm.loading) {
      vm.loading = true;
      UserService.loadUsers(USER_URL_ENDPOINT_CONST);
      vm.loading = false;
    } else {
      console.log('an operation already ongoing');
    }
  }

}

export { UserController };`;


const expectedTsClass = `'use strict';

import _ from 'lodash';

class UserController {
  private vm: any;
  private count: any;
  private count2: any;

  constructor(private $location: any, private UserService: any, private USER_URL_ENDPOINT_CONST: any) {
    this.vm = this;
    this.count = null;
    this.count2 = this.getNumber();
    this.vm.count3 = this.getNumber() + count2;

    _.extend(this.vm, {
      loading: true,
      messages: []
    });

    this.loadUsers();
  }

  loadUsers() {
    const xyz = 123;

    if (!this.vm.loading) {
      this.vm.loading = true;
      this.UserService.loadUsers(this.USER_URL_ENDPOINT_CONST);
      this.vm.loading = false;
    } else {
      console.log('an operation already ongoing');
    }
  }

}

export { UserController };
`;

const mapData = (): Map<string, BasicModule> => {
  const result = new Map<string, BasicModule>();
  const raw = JSON.parse(mapDataObj)
  Object.keys(raw).forEach(id => {
    result.set(id, raw[id]);
  });
  return result;
}


export { source, createTestData, deleteTestData, mapData, moduleExample, moduleImportDeclarationJson, factoryFunctionFile, serviceClassFile, serviceWithVariableDeclaration, exampleFunction, expectedClass, expectedTsClass };
