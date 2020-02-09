import { TraverseResult } from '../../vendors/helpers/traverse-result';
import { CallExpression, MemberExpression, program, Statement, VariableDeclaration, FunctionDeclaration } from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import template from '@babel/template';
import generate from '@babel/generator';
import { Node } from '@babel/types';
import { File, Identifier } from '@babel/types';

import * as fs from 'fs';


function writeContentToFile(xPath: NodePath<VariableDeclaration | FunctionDeclaration>, sourceTemplate: any, contentId: string, contentName: string, currentDir: string) {

  const code = generate((xPath.node as Node)).code

  const result = sourceTemplate({
    content: code,
    contentId
  }) as Statement[];

  const p = program(result);
  const controllerContent = generate(p).code;
  currentDir = currentDir ? currentDir + '/': '';

  fs.writeFileSync(`${currentDir}${contentId.toLowerCase()}.${contentName}.ts`, controllerContent);
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
    }
  })
}

function extract(expression: CallExpression, file: File, fileTemplate: string, currentDir: string) {

  const sourceTemplate = template(fileTemplate, {
    allowImportExportEverywhere: true
  });

  if (expression.arguments && expression.arguments.length > 0) {
    if(expression.callee.type == "MemberExpression") {
      const callee: MemberExpression = expression.callee;
      const callerName = callee.property['name']; // can be .config(..) .controller('xx',..), .constanst
      const argument = expression.arguments.length === 1 ? expression.arguments[0] : expression.arguments[1];

      let functionId = ""
      if(argument.type === "StringLiteral") {
        functionId = argument.value;
      } else if(argument.type === "Identifier") {
        functionId = argument.name;
      }
      console.log(`${callerName} - ${functionId}`);

      extractContentToFile(file, sourceTemplate, functionId, callerName, currentDir);
      if (callee.object.type === "CallExpression") {
        extract(callee.object, file, fileTemplate, currentDir);
      }
    }
  } else {
    if(expression.callee.type === "MemberExpression" && expression.callee.object.type === "CallExpression") {
      extract(expression.callee.object, file, fileTemplate, currentDir);
    }
  }
}
const splitDeclaration = (traverseResult: TraverseResult, currentDir: string): void => {

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
    extract(expression, file, fileTemplate, currentDir);
  }
};


export {splitDeclaration};
