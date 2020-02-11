import { processFile } from "./process-file.service";
import { createTestData, deleteTestData } from "../helpers/test.data";

describe("ProcessFileService", () => {
  const TEST_NAME = 'ProcessFileService';
  let filePath = '';
  beforeEach(() => {
    filePath = createTestData(TEST_NAME);
  });

  test("should read file contain and extract it", done => {
    processFile(filePath).subscribe(result => {
      expect(result).toBeTruthy();
      done();
    });
  });


  afterEach(() => {
    deleteTestData(TEST_NAME);
  });
});
