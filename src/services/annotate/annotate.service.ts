import { FilePath } from '../split/module.type';
import { openFile } from '../../vendors/helpers/file.helper';
import { File, traverse, ImportSpecifier, Literal } from '@babel/types';
import { parseSourceTypeModule } from '../../vendors/helpers/code-parser.helper';
import { findModule } from '../../vendors/helpers/traverse.helper';


const annotateModule = (filePath: FilePath) => {
  // 1. open file
  // 2. search module configs
  // 3. for every module config
  //   => get the id
  //   => read the corresponding import
  //   => open the corresponding file
  //   => search function declaration/class declaration with the same id
  //   => get functions arguments or get class arguments^
  //   => create a new array expression with the string litteral + the id
  //   => update the expression call
  // 4. write the new module declaration to the file
  // 5. repeat if next

  const content = openFile(filePath);
  const moduleConfigs = searchModuleConfigs(content);
  return '';
};


export { annotateModule };
