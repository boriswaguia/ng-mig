import { moduleExample, serviceClassFile, factoryFunctionFile, deleteTestData, serviceWithVariableDeclaration } from '../../../helpers/test.data';
import { searchRequiredServices } from './search-required-services';
import { writeFileSync, mkdirSync } from '../../../vendors/helpers/file.helper';
import { ServiceQuery } from './service-query';
import * as path from 'path';
import * as os from 'os';

describe('SearchRequiredServices', () => {

  const TEST_NAME = 'SearchRequiredServices';
  let testDir = '';
  let moduleFilePath = '';


  const mkdirs = (dirs: string[]) => dirs.forEach(d => mkdirSync(d));

  beforeEach(() => {

    testDir = path.join(os.tmpdir(), 'ng-mig', TEST_NAME);

    try {
      deleteTestData(testDir);
    } catch (err) {
      console.log('err', err);
    }
    mkdirs([testDir, testDir+'/src/app/home']);
    moduleFilePath = testDir+'/src/app/home/module.js';
    writeFileSync(moduleFilePath, moduleExample);
    writeFileSync(testDir+'/src/app/home/factoryfunction.factory.js', factoryFunctionFile);
    writeFileSync(testDir+'/src/app/home/userservice.factory.js', serviceClassFile);
    writeFileSync(testDir+'/src/app/home/dummyservice.factory.js', serviceWithVariableDeclaration);
  });

  test('should return list of required service for a given import function item', () => {
    const serviceQuery: ServiceQuery = {elementId: 'FactoryFunction', importPath: './factoryfunction.factory'};
    const expected =  ['$stateProvider', '$location'];
    const result = searchRequiredServices(serviceQuery, moduleFilePath);
    expect(result).toEqual(expected);
  });

  test('should return list of required service for a given import class item', () => {
    const serviceQuery: ServiceQuery = {elementId: 'UserService', importPath: './userservice.factory'};
    const expected =  ['ServiceA', '$http'];
    const result = searchRequiredServices(serviceQuery, moduleFilePath);
    expect(result).toEqual(expected);
  });

  test('should return list of required service for a given import variable function item', () => {
    const serviceQuery: ServiceQuery = {elementId: 'DummyService', importPath: './dummyservice.factory'};
    const expected =  ['$stateProvdier', 'ServiceA'];
    const result = searchRequiredServices(serviceQuery, moduleFilePath);
    expect(result).toEqual(expected);
  });

});
