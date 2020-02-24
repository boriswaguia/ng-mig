import * as t from '@babel/types';

export interface ClassMeta {
  // class Id
  id?: t.Identifier | undefined;
  // extract contructor params
  constrParams?: t.Identifier[];
  // extract assigment variables
  assigmentVars?: t.Identifier[];
  // extract constructor init statement
  initStatements?: t.ExpressionStatement[];
  // extract class method declarations
  classMethods?: t.ClassMethod[];
}
