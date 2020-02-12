import { extractModuleDeclaration } from "./module.service";

import { splitDeclaration } from "./split.service";
import { openFile } from "../../vendors/helpers/file.helper";
import { createTestData, deleteTestData } from "../../helpers/test.data";

describe("ModuleSplitService", () => {
  const TEST_NAME = 'ModuleSplitService';
  let filePath = "";

  beforeEach(() => {
    filePath = createTestData(TEST_NAME)+'/src/app/employees/employees.ui.js';
  });


  test("should extract four files with from a given module", done => {
    extractModuleDeclaration(openFile(filePath)).subscribe(r => {
      splitDeclaration(r, filePath);
      // expect(result).toHaveLength(4)
      done();
    });
  });

  afterEach(() => {
    deleteTestData(TEST_NAME);
  });
});
