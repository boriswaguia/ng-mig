import { deleteTestData, createTestData } from '../../helpers/test.data';
import { processFolder } from '../process-file.service';
import { extractBasicModule } from './dependent-module.service';

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
    console.log('DependentModuleImport-testDir', testDir);
    console.log('testdir', testDir);
    processFolder(testDir);
  })
  // test('Should update dependent modules import', () => {
  //   // given two angular js module files, with one module having dependency to the other module
  //   const appModule = `${testDir}/src/app/app.module.js`;
  //   const file2 = `${testDir}/src/app/datatypes/text.ui.module.js`;
  //   // when we run module-import command

  //   // then, the file depending of the module definition
  //   //must also have the import statement of the file declaring the module
  // });

  test('should extract list of dependent modules', (done) => {
    const modulePath = `${testDir}/src/app/app.module.js`;
    const expectedId = 'ak';
    const expectedDepModules = ['ak.home.ui', 'ak.navbar.ui', 'ak.footer.ui', 'ui.router'];

    extractBasicModule(modulePath).subscribe(r => {
      expect(r).not.toBeUndefined();
      expect(r?.id).toBe(expectedId);
      expect(r?.required).toEqual(expectedDepModules);
      done();
    }, err => {
      console.log('result', err);
      done();
    })
  });

  afterEach(() => {
  })

});
