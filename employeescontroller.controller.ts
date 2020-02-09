'use strict';

import _ from 'lodash';
function EmployeesController(EMPLOYEES) {
  var vm = this;

  _.extend(vm, {
    employees: EMPLOYEES
  });
};
export { EmployeesController };