import * as t from '@babel/types';
import traverse from '@babel/traverse';

const extractDeclaredFunctions = (functionDeclaration: t.FunctionDeclaration) => {
  const results: t.FunctionDeclaration[] = [];
  traverse(functionDeclaration, {
    noScope: true,
    FunctionDeclaration: function(xPath) {
      const closestParent = xPath.getFunctionParent();
      if(closestParent.isFunctionDeclaration() && closestParent.node.id === functionDeclaration.id) {
        results.push(xPath.node);
      }
    }
  })
  return results;
};


export { extractDeclaredFunctions };
