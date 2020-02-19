import { ServiceQuery } from './service-query';
import { createAbsolutePath } from './import-path-to-full-path.service';
import { FilePath } from '../../split/module.type';
import { FunctionDeclaration, ClassDeclaration, File, Identifier, ClassBody, VariableDeclarator, FunctionExpression } from '@babel/types';
import { parseFileSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import traverse from '@babel/traverse';

type D = FunctionDeclaration | ClassDeclaration | FunctionExpression | undefined;

const searchItem = (filePath: FilePath, searchedElt: string): D => {
  // 1. open the file
  // 2. traverse and check id with name
  // 3. return
  let r : D = undefined;
  const file: File = parseFileSourceTypeModule(filePath);
  traverse(file, {
    VariableDeclaration: function(xPath) {
      if (xPath.parent.loc?.start.line === 1) {
        const declarations: VariableDeclarator[] = [...xPath.node.declarations];
        const valids = declarations.filter(d => {
          return (d.id as Identifier).name === searchedElt && d.init?.type === "FunctionExpression";
        });
        if (valids.length >= 1 && valids[0].init) {
          r = (valids[0].init as FunctionExpression);
        }
      }
    },
    FunctionDeclaration: function(xPath) {
      if(xPath.parent.loc?.start.line === 1 && xPath.node.id?.name === searchedElt) {
        r = xPath.node
      }
    },
    ClassDeclaration: function(xPath) {
      if(xPath.parent.loc?.start.line === 1 && xPath.node.id?.name === searchedElt) {
        r = xPath.node;
      }
    }
  });
  return r;
};

const findRequiredServices = (item: D): string[] => {
  if (!item) return [];
  if (item.type === "FunctionDeclaration" || item.type === "FunctionExpression") {
    return item.params.map(p => (p as Identifier).name)
  } else {
    const classBody = item.body as ClassBody;
    let result: string[] = [];
    traverse(classBody, {
      noScope: true,
      ClassMethod: function(xPath) {
        if (xPath.node.kind === "constructor") {
          result = xPath.node.params.map(p => (p as Identifier).name);
        }
      }
    });
    return result;
  }
};

const searchRequiredServices = (serviceQuery: ServiceQuery, currentFilePath: FilePath) => {
  // 1. get the file full path
  // 2. search the function/class with the givent elementId
  // 3. get it's constructors or arguments parameters
  // 4. map result to expected return
  // 5. return

  const filePath = createAbsolutePath(serviceQuery.importPath, currentFilePath, '.js');// 1
  const item: D = searchItem(filePath, serviceQuery.elementId); // 2
  const requiredServices = findRequiredServices(item);// 3
  return requiredServices;
};

export { searchRequiredServices };
