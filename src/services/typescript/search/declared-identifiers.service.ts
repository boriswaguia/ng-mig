import * as t from '@babel/types';
import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import traverse from '@babel/traverse';

const extractDeclaredIds = (source: string, options = {constructorParams : true, constructorInit: true, declaredFuncions: true}) => {

  // load the file ast
  // extract constructor
  // extract constructor params
  // extract constructor variable assigments
  // extract class methods
  // create array ids

  const file: t.File =  parseSourceTypeModule(source);
  const results: string[] = [];

  const ids: t.Identifier[] = [];

  traverse(file, {
    ClassMethod: function(xPath) {
      const node = xPath.node;

      if (t.isIdentifier(node.key) &&  node.kind !== 'constructor') {
        ids.push(node.key);
        results.push(node.key.name);
      }
      if (node.kind === 'constructor') {
        // extract arguments
        node.params.forEach(p => {
          if (p.type === 'Identifier') {
            ids.push(p);
            results.push(p.name);
          }
        })
        // extract assignments vars
        traverse(node.body, {
          noScope: true,
          AssignmentExpression: function(path) {
            if (t.isMemberExpression(path.node.left) && t.isThisExpression(path.node.left.object) && t.isIdentifier(path.node.left.property)) {
              const property = path.node.left.property;
              ids.push(property);
              results.push(property.name);
            }
          }
        })
      }
    }
  });
  return results;
};

export { extractDeclaredIds };
