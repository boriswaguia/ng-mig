import * as t from '@babel/types';
import traverse from '@babel/traverse';

const extractDirectInnerExpressionStatements = (functionDeclation: t.FunctionDeclaration) => {
  const results: t.ExpressionStatement[] = [];

  traverse(functionDeclation, {
    noScope: true,
    ExpressionStatement: function (xPath) {
      const closestParentFunction = xPath.getFunctionParent();
      if (closestParentFunction.isFunctionDeclaration() && closestParentFunction.node.id === functionDeclation.id) {
        results.push(xPath.node);
      }
    }
  })
  return results;
};

export { extractDirectInnerExpressionStatements };
