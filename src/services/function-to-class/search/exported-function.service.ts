import * as t from '@babel/types';
import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import { searchExportedMembersIds } from './exported-members.service';
import traverse from '@babel/traverse';

const searchExportedFunction = (code: string) => {
  const file = parseSourceTypeModule(code);
  return searchExportedFunctionFile(file);
};
const searchExportedFunctionFile = (file: t.File) => {
  // 3. search function main function with id
  const members = searchExportedMembersIds(file);
  const result: t.FunctionDeclaration[] = []
  traverse(file, {
    FunctionDeclaration: function(xPath) {
      const node = xPath.node;
      if(xPath.parent.loc?.start.line === 1 && members.find(m => node.id?.name === m)) {
        result.push(node);
      }
    }
  });
  return result;
};

export { searchExportedFunction };
