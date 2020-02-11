import { ANGULAR_JS_MODULE_PATTERN, FilePath } from './split/module.type';
import { findModule } from '../vendors/helpers/traverse.helper';
import { tap } from 'rxjs/operators';
import { splitDeclaration } from './split/split.service';
import { openFile } from '../vendors/helpers/file.helper';

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
  processFile(p).subscribe(r => console.log(`processing ${p} is node`));
});

export { processFile, processFiles }
