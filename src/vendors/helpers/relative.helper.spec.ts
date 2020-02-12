import { relativePath, relativeImportPath } from './relative.helper';

describe('RelativeHelper', () => {

  beforeEach(() => {

  })
  test('should create relative path up to root', () => {
    const file1 = 'testdata/src/app/app.js';
    const file2 = 'testdata/src/app/employees/employees.js';
    const path = relativePath(file1, file2);
    expect(path).toBe('./employees/employees.js');
  });

  test('should create import path', () => {
    const file1 = 'testdata/src/app/app.js';
    const file2 = 'testdata/src/app/employees/employees.js';
    const path = relativeImportPath(file1, file2);
    expect(path).toBe('./employees/employees');
  });
});
