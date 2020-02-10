'use strict';

import * as angular from 'angular';
import { controller } from './controller.EmployeesController.ts'; 
import { constant } from './constant.EMPLOYEES.ts'; 
import { config } from './config.route.ts'; 
;
angular.module('ak.employees.ui', ['ui.router', 'smart-table']).config(route).constant('EMPLOYEES', EMPLOYEES).controller('EmployeesController', EmployeesController);;