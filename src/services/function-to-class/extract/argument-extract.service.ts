import * as t from '@babel/types';

const extractArgumentsIds = (functionDeclaration: t.FunctionDeclaration) => {
  return functionDeclaration.params.map(fd => (fd as t.Identifier).name as string);
};

export { extractArgumentsIds };
