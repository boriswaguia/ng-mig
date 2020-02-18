import { moduleExample, factoryFile } from '../../../helpers/test.data';
import { searchRequiredServices } from './search-required-services';
import { writeFileSync, mkdirSync } from '../../../vendors/helpers/file.helper';
import { ServiceQuery } from './service-query';
import * as path from 'path';
import * as os from 'os';

describe('SearchRequiredServices', () => {

  const TEST_NAME = 'SearchRequiredServices';
  let testDir = '';
  let moduleFilePath = '';
  let factoryFilePath = '';


  const mkdirs = (dirs: string[]) => dirs.forEach(d => mkdirSync(d));

  beforeEach(() => {
    testDir = path.join(os.tmpdir(), 'ng-mig', TEST_NAME);
    mkdirs([testDir, testDir+'/src/app/home']);
    moduleFilePath = testDir+'/src/app/home/module.js';
    factoryFilePath = testDir+'/src/app/home/factoryfunction.factory.js';
    writeFileSync(moduleFilePath, moduleExample);
    writeFileSync(factoryFilePath, factoryFile);
  });

  test('should return list of required service for a given import item', () => {
    const serviceQuery: ServiceQuery = {elementId: 'FactoryFunction', importPath: './factoryfunction.factory'};
    const expected =  ['$stateProvider', '$location'];
    const result = searchRequiredServices(serviceQuery, moduleFilePath);
    expect(result).toEqual(expected);
  });

});
