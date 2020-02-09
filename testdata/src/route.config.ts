'use strict';

import _ from 'lodash';
function route($stateProvider) {
  $stateProvider.state('ak.employees', {
    url: '/employees',
    views: {
      'content@': {
        templateUrl: 'app/employees/employees.html',
        controller: 'EmployeesController',
        controllerAs: 'vm'
      }
    }
  });
};
export { route };