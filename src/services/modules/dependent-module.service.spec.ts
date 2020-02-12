import { deleteTestData, createTestData } from '../../helpers/test.data';
import { processFolder } from '../process-file.service';
import { extractBasicModule, extractFilesDependenciesList } from './dependent-module.service';
import { getSourceFiles } from '../../vendors/helpers/dirwalk.helper';
import { jsonPrint } from '../../helpers/print.helper';

describe('DependentModuleImport', () => {
  const TEST_NAME = 'DependentModuleImport';
  let testDir = '';
  beforeEach(() => {
    try {
      deleteTestData(TEST_NAME);
    } catch (error) {
      console.log('error', error);
    }
    testDir = createTestData(TEST_NAME);
    processFolder(testDir);
  })

  test('should extract list of dependent modules', (done) => {
    const modulePath = `${testDir}/src/app/app.module.js`;
    const expectedId = 'ak';
    const expectedDepModules = ['ak.home.ui', 'ak.navbar.ui', 'ak.footer.ui', 'ui.router'];

    extractBasicModule(modulePath).subscribe(r => {
      expect(r.id).toBe(expectedId);
      expect(r.required).toEqual(expectedDepModules);
      expect(r.filePath).toEqual(modulePath);
      done();
    }, err => {
      console.log('result', err);
      done();
    })
  });

  test('build dependency lists', (done) => {
    const files = getSourceFiles(testDir);
    extractFilesDependenciesList(files).subscribe(registry => {
      expect(registry.size).toBe(5);
      done();
    })
  });

  afterEach(() => {
  })

});