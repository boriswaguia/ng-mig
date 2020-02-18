import { FilePath } from '../../split/module.type';
import * as path from 'path';

const createAbsolutePath = (importPath: string, currentFilePath: FilePath, extension = '') => {
  const dirName = path.dirname(currentFilePath);
  return path.resolve(dirName, importPath) + extension;
}

export { createAbsolutePath };
