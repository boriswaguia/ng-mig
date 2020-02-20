import * as t from '@babel/types';

const convertFunctionToClassMethods = (declaretedFunctions: t.FunctionDeclaration[]): t.ClassMethod[] => {

  return declaretedFunctions.map(df => {

    const key = t.identifier((df.id as t.Identifier).name);
    const params = df.params;
    const body = df.body;
    let result = t.classMethod("method", key, params, body);
    return result;
  });
};

export { convertFunctionToClassMethods };
