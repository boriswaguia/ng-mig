import { TraverseResultExpressionStatement } from '../../vendors/helpers/traverse-result';
import { CallExpression, MemberExpression, program, Statement, VariableDeclaration, FunctionDeclaration, ExpressionStatement, ClassDeclaration } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import template from '@babel/template';
import generate from '@babel/generator';
import { Node } from '@babel/types';
import { File, Identifier } from '@babel/types';

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
      const declaration = xPath.node.declarations.filter(x => (x.id as Identifier).name === contentId);
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

      let argumentId = ""
      if(argument.type === "StringLiteral" && callerName !== "constant") {
        argumentId = argument.value;
      } else if(argument.type === "Identifier") {
        argumentId = argument.name;
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
const splitDeclaration = (traverseResult: TraverseResultExpressionStatement, filePath: FilePath): void => {
  const {file, modulePath} = traverseResult

  const node = modulePath.node;


  const fileTemplate = `
  'use strict';

  import _ from 'lodash';


  %%content%%


  export { %%contentId%% };

  `;

  if (node.expression.type === "CallExpression") {
    const expression: CallExpression = node.expression;
    const importAccumulator = new Map<string, string>();
    extract(expression, file, fileTemplate, dirName(filePath), importAccumulator);

    if (importAccumulator.size > 0) {
      console.log('importAccumulator', importAccumulator);
      createNewModule(filePath, node, importAccumulator);
      renameSync(filePath, filePath+'.processed');
    }
  }
};


export {splitDeclaration};
