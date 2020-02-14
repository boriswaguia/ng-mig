import { TraverseResultExpressionStatement } from '../../vendors/helpers/traverse-result';
import { CallExpression, MemberExpression, program, Statement, VariableDeclaration, FunctionDeclaration, ExpressionStatement, ClassDeclaration, StringLiteral } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import template from '@babel/template';
import generate from '@babel/generator';
import { Node } from '@babel/types';
import { File, Identifier, matchesPattern } from '@babel/types';


import { dirName, fileName, writeFileSync, renameSync } from '../../vendors/helpers/file.helper';
import { FilePath } from './module.type';


const getFileName = (currentDir: string, contentId: string, contentName: string) => `${currentDir}${contentId.toLowerCase()}.${contentName}.js`;

function writeContentToFile(xPath: NodePath<VariableDeclaration | FunctionDeclaration | ClassDeclaration>, sourceTemplate: any, contentId: string, contentName: string, currentDir: string) {

  const code = generate((xPath.node as Node)).code

  const result = sourceTemplate({
    content: code,
    contentId
  }) as Statement[];

  const p = program(result);
  const controllerContent = generate(p).code;
  currentDir = currentDir ? currentDir + '/': '';
  const newFile = getFileName(currentDir, contentId, contentName);
  console.log('newFile', newFile);
  writeFileSync(newFile, controllerContent);
}

function extractContentToFile(file: File, sourceTemplate: any, contentId: string, contentName: string, currentDir: string) {
  traverse(file, {
    VariableDeclaration: function(xPath) {
      const parentStartLine = xPath.parentPath.node.loc?.start.line;
      // test if name match, and is direct child of the main programm.
      const declaration = xPath.node.declarations.filter(x => (x.id as Identifier).name === contentId && parentStartLine === 1);
      if (declaration.length > 0) {
        writeContentToFile(xPath, sourceTemplate, contentId, contentName, currentDir);
      }
    },
    FunctionDeclaration: function(xPath) {
      if(xPath.node.id?.name === contentId) {
        writeContentToFile(xPath, sourceTemplate, contentId, contentName, currentDir);
      }
    },
    ClassDeclaration: function(xPath) {
      if(xPath.node.id?.name === contentId) {
        writeContentToFile(xPath, sourceTemplate, contentId, contentName, currentDir);
      }
    }
  })
}

function extract(expression: CallExpression, file: File, fileTemplate: string, currentDir: string, importAccumulator: Map<string, string>) {

  const sourceTemplate = template(fileTemplate, {
    allowImportExportEverywhere: true
  });

  if (expression.arguments && expression.arguments.length > 0) {
    if(expression.callee.type == "MemberExpression") {
      const callee: MemberExpression = expression.callee;
      const callerName = callee.property['name']; // can be .config(..) .controller('xx',..), .constanst
      const argument = expression.arguments.length === 1 ? expression.arguments[0] : expression.arguments[1];

      let argumentId:any;

      if(argument.type === "StringLiteral" && callerName !== "constant") {
        argumentId = argument.value;
      } else if(argument.type === "Identifier") {
        argumentId = argument.name;
      } else if (argument.type === "ObjectExpression" || argument.type === "FunctionExpression") {
        // Use the first argument as identifier in case of think like this : .component('apFooter', {key: val, key: val})
        argumentId = expression.arguments.length === 2 ? (expression.arguments[0] as StringLiteral).value : undefined;
        const objectDeclaration = {...argument};

        // Refactor code and create a new variable declaration
        // i.e:
        // .component('apFooter', {key: val, key: val})
        // (final result should be like this)
        // const apFooter = {key: val, key: val}
        // update the argument params and use an identifier instead of objectexpression
        // .component('apFooter', apFooter)
        const variableDeclaration = template(`const %%argumentId%% = %%objectDeclaration%%;`);
        const {loc, start, end} = argument;
        const a : Identifier = {type: "Identifier", name: argumentId, loc, start, decorators:null, end, optional: false, typeAnnotation: null, leadingComments: null, innerComments: null, trailingComments: null};
        expression.arguments[1] = a;
        traverse(file, {
          ExpressionStatement: function(expressionPath) {

            traverse(
              expressionPath.node,
              {
                noScope: true,
                enter(path2: NodePath) {
                  const angularDeclFound = matchesPattern(path2.node, "angular", true);
                  if (angularDeclFound && expressionPath.node.loc && expressionPath.node.loc.start.line > 1) {
                    const statement = variableDeclaration({
                      argumentId,
                      objectDeclaration: objectDeclaration
                    });
                    expressionPath.insertAfter(statement);
                  }
                }
              }
            );
          }
        });
      }

      console.log(`${callerName} - ${argumentId}`);

      if (argumentId) {
        importAccumulator.set(argumentId, callerName);
        extractContentToFile(file, sourceTemplate, argumentId, callerName, currentDir);
      }
      if (callee.object.type === "CallExpression") {
        extract(callee.object, file, fileTemplate, currentDir, importAccumulator);
      }
    }
  } else {
    if(expression.callee.type === "MemberExpression" && expression.callee.object.type === "CallExpression") {
      extract(expression.callee.object, file, fileTemplate, currentDir, importAccumulator);
    }
  }
}

const createNewModule = (filePath: FilePath, node: ExpressionStatement, importAccumulator: Map<string, string>) => {
  const newModuleTemplate = `
  'use strict';

  import * as angular from 'angular'


  %%moduleImports%%


  %%moduleDeclaration%%


  `;

  const moduleTemplate = template(newModuleTemplate, {
    allowImportExportEverywhere: true
  });

  let moduleImports: string = ``;
 importAccumulator.forEach((value, key) => {
   const importS = `import { ${key} } from './${key.toLowerCase()}.${value}'; \n`;
   moduleImports = moduleImports + importS;
 });

 console.log('import', moduleImports);

 const result = moduleTemplate({
    moduleImports,
    moduleDeclaration: generate(node).code
  }) as Statement[];
  const p = program(result);

  const controllerContent = generate(p).code;

  const name = fileName(filePath).replace('.js', '');
  const newFile = getFileName(dirName(filePath)+'/', name, 'module');
  console.log('newFileModule', newFile);
  writeFileSync(newFile, controllerContent);
}
const splitDeclaration = (traverseResult: TraverseResultExpressionStatement, filePath: FilePath): number => {
  const {file, modulePath} = traverseResult

  const node = modulePath.node;


  const fileTemplate = `
  'use strict';

  import _ from 'lodash';


  %%content%%


  export { %%contentId%% };

  `;
  let numberOfImported = 0;
  if (node.expression.type === "CallExpression") {
    const expression: CallExpression = node.expression;
    const importAccumulator = new Map<string, string>();
    extract(expression, file, fileTemplate, dirName(filePath), importAccumulator);

    if (importAccumulator.size > 0) {
      console.log('importAccumulator', importAccumulator);
      createNewModule(filePath, node, importAccumulator);
      renameSync(filePath, filePath+'.processed');
      numberOfImported = importAccumulator.size;
    }
  }
  return numberOfImported;
};


export {splitDeclaration};
