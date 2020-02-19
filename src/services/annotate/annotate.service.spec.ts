import { createTestData, deleteTestData } from '../../helpers/test.data';
import { createArrayStatement, annotateModule } from './annotate.service';
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

test('should create array expression', () => {
  const tokens = ['UserService', '$location'];
  const serviceName = 'UserController';

  const statement = createArrayStatement(serviceName, tokens);

  const expected = `{"type":"ArrayExpression","elements":[{"type":"StringLiteral","value":"UserService"},{"type":"StringLiteral","value":"$location"},{"type":"Identifier","name":"UserController"}]}`;
  const json = JSON.stringify(statement);
  console.log(json);
  expect(json).toBe(expected);
});
  // test('should add all annotate to extracted function', async (done) => {
  //   const originalFile = testDir+'/src/app/special-cases/module-has-unused-function.js';

  //   const extracted = await extractModuleDeclaration(openFile(originalFile)).toPromise();
  //   splitDeclaration(extracted, originalFile);
  //   const content = await annotateModule(testDir+'/src/app/special-cases/module-has-unused-function.module.js');
  //   console.log('----------content-----', content);
  //   expect(content).toContain(`factory("FactoryFunction", ["$stateProvider", "$location", FactoryFunction])`);
  //   expect(true).toBeTruthy();
  //   done();
  // });
});
