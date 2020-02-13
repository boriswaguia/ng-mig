import { extractModuleDeclaration } from "./module.service";

import { splitDeclaration } from "./split.service";
import { openFile } from "../../vendors/helpers/file.helper";
import { createTestData, deleteTestData } from "../../helpers/test.data";

describe("ModuleSplitService", () => {
  const TEST_NAME = 'ModuleSplitService';
  let testDir = '';
  beforeEach(() => {
    try {
      deleteTestData(TEST_NAME);
    } catch (err) {
      console.log('error', err);
    }
    // filePath = createTestData(TEST_NAME)+'/src/app/employees/employees.ui.js';
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

  test("should extract four files with from a given module", done => {
    const filePath = testDir+'/src/app/footer/footer.ui.js'
    extractModuleDeclaration(openFile(filePath)).subscribe(r => {
      const numberOfImported = splitDeclaration(r, filePath);
      expect(numberOfImported).toBe(1);
      done();
    });
  });

  afterEach(() => {
    // deleteTestData(TEST_NAME);
  });
});
