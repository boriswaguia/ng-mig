import { TraverseResult } from '../../vendors/helpers/traverse-result';
import { CallExpression, MemberExpression, program, Statement } from '@babel/types';
import traverse from '@babel/traverse';
import template from '@babel/template';
import generate from '@babel/generator';
import { Node } from '@babel/types';
import { File } from '@babel/types';

import * as fs from 'fs';

function extractContentToFile(file: File, sourceTemplate: any, contentId: string) {
  traverse(file, {
    FunctionDeclaration: function(xPath) {
      // jsonPrint('controller', xPath.node);
      if(xPath.isFunctionDeclaration() && xPath.node.loc && xPath.node.id && xPath.node.id.name === contentId) {

        const code = generate((xPath.node as Node)).code

        const result = sourceTemplate({
          content: code,
          contentId
        }) as Statement[];

        const p = program(result);
        const controllerContent = generate(p).code;
        fs.writeFileSync(`${contentId.toLowerCase()}.component.ts`, controllerContent);
      }
    }
  })
}

function extract(expression: CallExpression, file: File, fileTemplate: string) {

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

      extractContentToFile(file, sourceTemplate, functionId);
      if (callee.object.type === "CallExpression") {
        extract(callee.object, file, fileTemplate);
      }
    }
  } else {
    if(expression.callee.type === "MemberExpression" && expression.callee.object.type === "CallExpression") {
      extract(expression.callee.object, file, fileTemplate);
    }
  }
}
const splitDeclaration = (traverseResult: TraverseResult): void => {

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
    extract(expression, file, fileTemplate);
  }
};


export {splitDeclaration};
