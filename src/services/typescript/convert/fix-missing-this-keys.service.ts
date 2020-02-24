import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { jsonPrint } from '../../../helpers/print.helper';

const createAThisMemberExpression = (id: string): t.MemberExpression => {
  const object = t.thisExpression();
  const property = t.identifier(id);
  const computed = false;
  const optional = false;
  const result = t.memberExpression(object, property, computed, optional);
  return result;
};

const isDeclared = (key: string, classVars: string[]) => classVars.filter(cv => cv === key).length > 0;

const fixMissingThisKeys = (classDeclaration: t.ClassDeclaration, classVars: string[]): t.ClassDeclaration => {
  // search all call expression callee
  // search member expression objects
  traverse(classDeclaration, {
    noScope: true,
    CallExpression: function(xPath) {
      if (t.isIdentifier(xPath.node.callee) && isDeclared(xPath.node.callee.name, classVars)) {
        xPath.node.callee = createAThisMemberExpression(xPath.node.callee.name);
      }
      if(xPath.node.arguments && xPath.node.arguments.length > 0) {
        xPath.node.arguments.forEach((arg, index) => {
          if (t.isIdentifier(arg) && isDeclared(arg.name, classVars)) {
            xPath.node.arguments[index] = createAThisMemberExpression(arg.name);
          }
        })
      }
    },
    MemberExpression: function(xPath) {
      if (t.isIdentifier(xPath.node.object) && isDeclared(xPath.node.object.name, classVars)) {
        xPath.node.object = createAThisMemberExpression(xPath.node.object.name);
      }
    }
  })

  return classDeclaration;
};


export { fixMissingThisKeys };
