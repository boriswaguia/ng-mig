import { ANGULAR_JS_MODULE_PATTERN, FilePath, FolderPath } from './split/module.type';
import { findModule } from '../vendors/helpers/traverse.helper';
import { tap } from 'rxjs/operators';
import { splitDeclaration } from './split/split.service';
import { openFile } from '../vendors/helpers/file.helper';
import { getSourceFiles } from '../vendors/helpers/dirwalk.helper';

const processFile = (filePath: FilePath) => {
  const source = openFile(filePath.valueOf());

  return findModule(source, ANGULAR_JS_MODULE_PATTERN.valueOf())
    .pipe(
      tap(result => {
        splitDeclaration(result, filePath);
      })
    );
}

const processFiles = (filePaths: FilePath[]): void => filePaths.forEach(p => {
  processFile(p).subscribe(
    r => console.log(`processing ${p} is node`),
    err => console.log(`error process file ${p}`, err));
});

const processFolder = (folderPath: FolderPath): void => {
  processFiles(getSourceFiles(folderPath));
}

export { processFile, processFiles, processFolder }
