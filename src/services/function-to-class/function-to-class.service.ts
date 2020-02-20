import * as t from "@babel/types";

import { searchExportedFunction } from "./search/exported-function.service";
import { extractRootVariableDeclarations } from "./extract/root-scope-variable-declaration.service";
import { extractArgumentsIds } from "./extract/argument-extract.service";
import { extractDirectInnerExpressionStatements } from "./extract/expression-statements.service";
import { extractDeclaredFunctions } from "./extract/declared-function.service";
import { convertVarToAssigments } from "./convert/variable-to-constr-assignment.service";
import { convertFunctionToClassMethods } from "./convert/function-to-class-method.service";
import { parseSourceTypeModule } from '../../vendors/helpers/code-parser.helper';
import traverse from '@babel/traverse';
import generate from '@babel/generator';


const createConstructor = (declaredArguments: string[], varInits: t.ExpressionStatement[], classInitStatements: t.ExpressionStatement[]): t.ClassMethod => {

  const params = declaredArguments.map(fp => t.identifier(fp));
  const body = t.blockStatement([...varInits, ...classInitStatements])
  return t.classMethod("constructor", t.identifier("constructor"), params , body);
};

const createNewClass = (id: t.Identifier,constFunction:t.ClassMethod, classMethods: t.ClassMethod[]): t.ClassDeclaration => {
    const superClass = null;
    const body = t.classBody([constFunction, ...classMethods]);
    const decorators = null;
    const result = t.classDeclaration(id, superClass, body, decorators);
  return result;
};


const replaceFunctionWithClass = (code: string, ft: t.Identifier, classDeclaration: t.ClassDeclaration):t.File => {
  const file = parseSourceTypeModule(code);
  traverse(file, {
    FunctionDeclaration: function(xPath) {
      const id = xPath.node.id;
      if(id && (id.name === ft.name && id.loc?.start.line === ft.loc?.start.line && id.loc?.end.line === ft.loc?.end.line)) {
        xPath.replaceWith(classDeclaration);
      }
    }
  });
  return file;
}
const convertToClass = (code: string) => {
  // 1.
  const originalFunctions = searchExportedFunction(code);
  const selectedFunction = originalFunctions[0];
  // 2.
  // extract arguments
  const declaredArguments = extractArgumentsIds(selectedFunction);
  // extract function main scope variable declaration
  const declaredVariables = extractRootVariableDeclarations(
    selectedFunction
  );
  // extract function main scope expression statements
  const declaredExpressionsStatements = extractDirectInnerExpressionStatements(
    selectedFunction
  );
  // extract functions
  const declaredFunctions = extractDeclaredFunctions(selectedFunction);
  // 3.
  // convert functions variables declarations to constructor ExpressionStatement type AssigmentExpression
  const convertedVariables = convertVarToAssigments(declaredVariables);
  // convert function declarations to method definition kind 'method'
  const classMethods = convertFunctionToClassMethods(declaredFunctions);
  // 4.
  // create a new class with the same id// add a new contructor
  // add constructor arguments
  // add assigments to contructors
  // add other function expression statements
  const constructorFunction = createConstructor(declaredArguments, convertedVariables, declaredExpressionsStatements);

  const newClass = createNewClass(t.identifier(selectedFunction.id?.name), constructorFunction, classMethods);
  // 5.
  // replace main function declaration with class declaration
  const result = replaceFunctionWithClass(code, selectedFunction.id!, newClass);
  return result;
};

export { convertToClass };
