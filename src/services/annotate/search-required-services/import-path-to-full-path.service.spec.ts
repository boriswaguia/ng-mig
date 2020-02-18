import { createAbsolutePath } from './import-path-to-full-path.service';

describe('ImportPathToFullPathService', () => {

  test('should return absolute path given an import path', () => {
    const importPath = './footer/footer.controller';
    const currentFilePath = '/Users/user01/dev/project/src/app/home.ui.module.js';
    const expected = '/Users/user01/dev/project/src/app/footer/footer.controller.js';
    const result = createAbsolutePath(importPath, currentFilePath, '.js');
    expect(result).toBe(expected);
  });

  test('should return absolute path given an import with relative paths', () => {

    const currentFilePath = '/Users/user01/dev/project/src/app/home/home.ui.module.js';
    const importPath = '../footer/footer.controller';

    const expected = '/Users/user01/dev/project/src/app/footer/footer.controller';

    const result = createAbsolutePath(importPath, currentFilePath);
    expect(result).toBe(expected);
  });
});
