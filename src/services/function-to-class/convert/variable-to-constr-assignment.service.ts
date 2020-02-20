 import * as t from '@babel/types';

 const convertVarToAssigments = (vars: t.VariableDeclaration[]): t.ExpressionStatement[] => {
   const operator = '=';
   const declarators: t.VariableDeclarator[] = []
   vars.forEach(v => declarators.push(...v.declarations.map(d => (d as t.VariableDeclarator))));

    return declarators.map(d => {
      const object = t.thisExpression();
      const left = t.memberExpression(object, t.identifier((d.id as t.Identifier).name));
      const right = d.init ? d.init: t.nullLiteral();
      const assigmentExp = t.assignmentExpression(operator, left, right);
      const result = t.expressionStatement(assigmentExp);
      return result;
  });
};


export { convertVarToAssigments };
