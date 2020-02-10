'use strict';

import * as angular from 'angular';
import { EmployeesController } from './employeescontroller.controller'; 
import { EMPLOYEES } from './employees.constant'; 
import { route } from './route.config'; 
;
angular.module('ak.employees.ui', ['ui.router', 'smart-table']).config(route).constant('EMPLOYEES', EMPLOYEES).controller('EmployeesController', EmployeesController);;