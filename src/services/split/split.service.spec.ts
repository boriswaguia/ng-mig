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

    test("should extract wrapper function not nested", (done) => {
      const filePath = testDir+'/src/app/special-cases/has-identic-nested-function-name.js';
      const expectedFile = testDir+'/src/app/special-cases/nestedcontroller.controller.js'
      extractModuleDeclaration(openFile(filePath)).subscribe(r => {
        const numberOfImported = splitDeclaration(r, filePath);
        expect(numberOfImported).toBe(1);
        expect(pathExistsSync(expectedFile)).toBeTruthy();
        expect(openFile(expectedFile)).toContain(`function NestedController(args) {`)
        done();
      });
    });

    test("should extract module factory and leave unextracted functions", (done) => {
      const filePath = testDir+'/src/app/special-cases/module-has-unused-function.js';
      const expectedModuleFile = testDir+'/src/app/special-cases/module-has-unused-function.module.js';
      const expectedFile = testDir+'/src/app/special-cases/factoryfunction.factory.js';
      extractModuleDeclaration(openFile(filePath)).subscribe(r => {
        const numberOfImported = splitDeclaration(r, filePath);
        expect(numberOfImported).toBe(4);
        expect(pathExistsSync(expectedFile)).toBeTruthy();
        expect(openFile(expectedFile)).toContain(`function FactoryFunction($stateProvider, $location) {`);
        const moduleContent = openFile(expectedModuleFile) ;
        expect(moduleContent).toContain(`function unusedFunction(arg) {`);
        expect(moduleContent).toContain(`function secondUnusedFunction(ars) {`);
        expect(moduleContent).toContain(`var echo = "fd";`);
        expect(moduleContent).not.toContain(`class UserService {`);
        done();
      });
    });

  afterEach(() => {
    // deleteTestData(TEST_NAME);
  });
});
