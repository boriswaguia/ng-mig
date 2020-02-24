import * as t from '@babel/types';

export interface ClassMeta {
  // extract contructor params
  constrParams?: t.Identifier[];
  // extract assigment variables
  assigmentVars?: t.Identifier[];
  // extract constructor init statement
  initStatements?: t.ExpressionStatement[];
  // extract class method declarations
  classMethods?: t.ClassMethod[];
}
