import * as t from '@babel/types';
import traverse from '@babel/traverse';


const extractRootVariableDeclarations = (functionDeclaration: t.FunctionDeclaration): t.VariableDeclaration[] => {
  const results: t.VariableDeclaration[] = [];
  traverse(functionDeclaration, {
    noScope: true,
    VariableDeclaration: function(xPath) {
      const closestParent = xPath.getFunctionParent();
      if(closestParent.isFunctionDeclaration() && closestParent.node.id === functionDeclaration.id) {
        results.push(xPath.node)
      }
    }
  })
  return results;
}

export { extractRootVariableDeclarations };
