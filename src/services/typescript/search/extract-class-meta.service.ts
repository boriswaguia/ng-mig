import { ClassMeta } from '../class-meta.interface';
import * as t from '@babel/types';
import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import traverse from '@babel/traverse';

const extractAllClassMetaInfos = (source: string): ClassMeta => {

  // class Id
  let id: t.Identifier | undefined = undefined;

  // extract contructor params
  const assigmentVars: t.Identifier[] = [];
  // extract assigment variables
  const constrParams: t.Identifier[] = [];
  // extract constructor init statement
  const initStatements: t.ExpressionStatement[] = []
  // extract function declarations
  const classMethods: t.ClassMethod[] = [];

  const file = parseSourceTypeModule(source);

  traverse(file, {
    ClassDeclaration: function(xPath) {
      id = xPath.node.id;
    },
    ClassMethod: function(xPath) {
      const node = xPath.node;

      if (t.isIdentifier(node.key) &&  node.kind !== 'constructor') {
        classMethods.push(node);
      }
      if (node.kind === 'constructor') {
        // extract arguments
        node.params.forEach(param => {
          if (param.type === 'Identifier') {
           constrParams.push(param);
          }
        })
        // extract assignments vars
        traverse(node.body, {
          noScope: true,
          AssignmentExpression: function(path) {
            if (t.isMemberExpression(path.node.left) && t.isThisExpression(path.node.left.object) && t.isIdentifier(path.node.left.property)) {
              const property = path.node.left.property;
              assigmentVars.push(property);
            }
          },
          ExpressionStatement: function(xPath) {
            const closestParentFunction = xPath.getFunctionParent();
            if (closestParentFunction.isClassMethod() && closestParentFunction.node.id?.name === 'constructor') {
              initStatements.push(xPath.node);
            }
          }
        })
      }
    }
  });

  const result: ClassMeta = {id, assigmentVars, constrParams, classMethods, initStatements};
  return result;
}
export { extractAllClassMetaInfos };
