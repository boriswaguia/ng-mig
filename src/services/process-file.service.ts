import { ANGULAR_JS_MODULE_PATTERN, FilePath } from './angular/module.type';
import { findModule } from '../vendors/helpers/traverse.helper';
import { tap } from 'rxjs/operators';
import { splitDeclaration } from './angular/split.service';
import { openFile, dirName } from '../vendors/helpers/file.helper';

const processFile = (filePath: FilePath) => {
  const fileDir = dirName(filePath);
  const source = openFile(filePath.valueOf());

  return findModule(source, ANGULAR_JS_MODULE_PATTERN.valueOf())
    .pipe(
      tap(result => {
        splitDeclaration(result, fileDir);
      })
    );
}

export {processFile}
