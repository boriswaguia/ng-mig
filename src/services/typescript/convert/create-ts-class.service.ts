import { ClassMeta } from '../class-meta.interface';
import { getCode } from '../helper/ts-node-to-tocode.helper';
import * as t from '@babel/types';
import { argToTsArg } from './args-to-tsargs.servce';


const createParamtInitStatement = (param: t.Identifier) => {
  const operator = '=';
  const object = t.thisExpression();
  const property = t.identifier(param.name);
  const computed = false;
  const optional = undefined;

  const right = t.identifier(param.name);
  const left = t.memberExpression(object, property, computed, optional);
  const expression = t.assignmentExpression(operator, left, right);
  const result = t.expressionStatement(expression);
  return result;
};

const createConstructorParamInitStmts = (params: t.Identifier[]) => {
  return params.map(p => createParamtInitStatement(p));
};

const classConstructor = (constrParams: t.Identifier[], initStatements: t.ExpressionStatement[]) => {
  const kind = 'constructor';
  const key = t.identifier('constructor');
  const body = t.blockStatement([...initStatements]);
  const computed = false;
  const isStatic = false;
  const generator = false;
  const async = false;
  const result = t.classMethod(kind, key, constrParams, body, computed, isStatic, generator, async);
  return result;
}

const idToTsProperty = (id: t.Identifier): t.ClassProperty => {
  const key = id;
  const typeAnnotation = undefined;
  const initialiser = undefined;
  // const result = t.tsPropertySignature(key, typeAnnotation, initialiser);
  const value = undefined;
  const type = t.typeAnnotation(t.anyTypeAnnotation());
  const decorators = undefined;
  const computed = false;
  const isStatic = false;
  const result = t.classProperty(key, value, type,decorators, computed, isStatic);
  return result;
}

const classProperties = (identifiers: t.Identifier[]): t.ClassProperty[] => {
  return identifiers.map(identifier => idToTsProperty(identifier))
};

const createClass = (id: t.Identifier, members: (t.ClassMethod | t.ClassPrivateMethod | t.ClassProperty | t.ClassPrivateProperty | t.TSDeclareMethod | t.TSIndexSignature)[]) => {
  const decorators = undefined;
  const superClass = undefined;
  const body = t.classBody(members);
  const classNode = t.classDeclaration(id, superClass, body, decorators);
  return classNode;
}
const filterDuplicateUsingMap = (assigmentVars: t.Identifier[], constrParams: t.Identifier[]) => {
  const result = new Map<string, t.Identifier>();
  assigmentVars.forEach(av  => result.set(av.name, av));
  constrParams.forEach(cp  => result.set(cp.name, cp));
  return [...result.values()];
};

const createTsClass = (classMeta: ClassMeta): t.ClassDeclaration => {
  // class properties
  const filteredProps = filterDuplicateUsingMap(classMeta.assigmentVars!, classMeta.constrParams!);
  const properties = [...classProperties(filteredProps)];
  // constructor
  const paramsInitStatements = createConstructorParamInitStmts(classMeta.constrParams!);
  const constr: t.ClassMethod = classConstructor(classMeta.constrParams!, [...paramsInitStatements, ...classMeta.initStatements!]);
  // declare class

  const result: t.ClassDeclaration = createClass(classMeta.id!, [...properties, constr, ...classMeta.classMethods!]);
  return result;
};

export { createTsClass };
