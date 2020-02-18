import { createTestData, deleteTestData } from '../../helpers/test.data';
import { annotateModule } from './annotate.service';
import { extractModuleDeclaration } from '../split/module.service';
import { splitDeclaration } from '../split/split.service';
import { openFile } from '../../vendors/helpers/file.helper';

describe('AnnotateService', () => {
  const TEST_FOLDER = 'AnnotateService';
  let testDir = '';
  beforeEach(() => {
    try {
      deleteTestData(TEST_FOLDER);
    } catch (err) {
      console.log('err', err)
    }
    testDir = createTestData(TEST_FOLDER);
  });
  test('should add all annotate to extracted function', async (done) => {
    const originalFile = testDir+'/src/app/special-cases/module-has-unused-function.js';

    const extracted = await extractModuleDeclaration(openFile(originalFile)).toPromise();
    splitDeclaration(extracted, originalFile);
    const content = annotateModule(testDir+'/src/app/special-cases/module-has-unused-function.module.js');
    expect(content).toContain(`factory("FactoryFunction", ['$stateProvider', '$location', FactoryFunction])`);
    expect(true).toBeTruthy();
    done();
  });
});
