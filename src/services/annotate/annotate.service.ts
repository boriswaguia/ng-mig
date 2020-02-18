import { FilePath } from '../split/module.type';
import { openFile } from '../../vendors/helpers/file.helper';
import { File, traverse, ImportSpecifier, Literal } from '@babel/types';
import { parseSourceTypeModule } from '../../vendors/helpers/code-parser.helper';
import { findModule } from '../../vendors/helpers/traverse.helper';
import { searchModuleConfigs } from './search-module-config/search-module-config.service';


const annotateModule = (filePath: FilePath) => {
  // 1. open file
  // 2. search module configs
  // 3. for imported module, search all the services they need
  // 4. create new array configs
  // 5. update angular module declaration expression

  const content = openFile(filePath);
  const moduleConfigs = searchModuleConfigs(content);
  // const requiredServices = searchRequiredServices(moduleConfigs);
  return '';
};


export { annotateModule };
