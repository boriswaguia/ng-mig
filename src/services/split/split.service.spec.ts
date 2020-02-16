import { extractModuleDeclaration } from "./module.service";

import { splitDeclaration } from "./split.service";
import { openFile, pathExistsSync } from "../../vendors/helpers/file.helper";
import { createTestData, deleteTestData } from "../../helpers/test.data";

describe("ModuleSplitService", () => {
  const TEST_NAME = 'ModuleSplitService';
  let testDir = '';
  beforeEach(() => {
    console.log('before');
    try {
      deleteTestData(TEST_NAME);
    } catch (err) {
      console.log('error', err);
    }
    testDir = createTestData(TEST_NAME);
  });


  test("should extract four files with from a given module", done => {
    const filePath = testDir+'/src/app/employees/employees.ui.js'
    extractModuleDeclaration(openFile(filePath)).subscribe(r => {
      const expectedImportedFiles = 3;
      const numberOfImported = splitDeclaration(r, filePath);
      expect(numberOfImported).toBe(expectedImportedFiles);
      done();
    });
  });

  test("should extract module with objectExpression as parameter argument", done => {
    const filePath = testDir+'/src/app/footer/footer.ui.js'
    extractModuleDeclaration(openFile(filePath)).subscribe(r => {
      const numberOfImported = splitDeclaration(r, filePath);
      expect(numberOfImported).toBe(1);
      expect(pathExistsSync(testDir+'/src/app/footer/akfooter.component.js')).toBeTruthy();
      expect(openFile(testDir+'/src/app/footer/akfooter.component.js')).toContain(`const akFooter = {`);
      expect(openFile(testDir+'/src/app/footer/akfooter.component.js')).toContain(`templateUrl: 'app/footer/footer.html'`);
      done();
    });
  });

  test("should correctly extract function having a variable declaration with the same name as the function", done => {
    const filePath = testDir+'/src/app/special-cases/has-identic-var-and-function-identifier.js';
    extractModuleDeclaration(openFile(filePath)).subscribe(r => {
      const numberOfImported = splitDeclaration(r, filePath);
      expect(numberOfImported).toBe(1);
      expect(pathExistsSync(testDir+'/src/app/special-cases/profilecontroller.controller.js')).toBeTruthy();
      done();
    });
  });

  test("should correctly extract function witch immediately return object", (done) => {
    const filePath = testDir+'/src/app/special-cases/module-has-return-object.js';

      extractModuleDeclaration(openFile(filePath)).subscribe(r => {
        const numberOfImported = splitDeclaration(r, filePath);
        expect(numberOfImported).toBe(1);
        expect(pathExistsSync(testDir+'/src/app/special-cases/mydirectiverequired.directive.js')).toBeTruthy();
        done();
      });
    });

    test("should correctly extract function expression in module argument immediately returning object", (done) => {
      const filePath = testDir+'/src/app/special-cases/func-arg-immediate-return-objs.js';
      const expectedFile = testDir+'/src/app/special-cases/funcargimmediatereturnobjsreturn.directive.js'
      extractModuleDeclaration(openFile(filePath)).subscribe(r => {
        const numberOfImported = splitDeclaration(r, filePath);
        expect(numberOfImported).toBe(1);
        expect(pathExistsSync(expectedFile)).toBeTruthy();
        expect(openFile(expectedFile)).toContain(`const funcArgImmediateReturnObjsReturn = function ($rootScope, scopeVars, appendTo) {`)
        done();
      });
    });


  afterEach(() => {
    // deleteTestData(TEST_NAME);
  });
});
