import { processFile } from "./process-file.service";
import { createTestData, deleteTestData } from "../helpers/test.data";

describe("ProcessFileService", () => {
  const TEST_NAME = 'ProcessFileService';
  let testDir = '';
  beforeEach(() => {
    testDir = createTestData(TEST_NAME);
  });

  test("should read file contain and extract it", done => {
    processFile(testDir+'/src/app/employees/employees.ui.js').subscribe(result => {
      expect(result).toBeTruthy();
      done();
    });
  });


  afterEach(() => {
    deleteTestData(TEST_NAME);
  });
});
