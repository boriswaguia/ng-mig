import { TraverseResult } from '../../vendors/helpers/traverse-result';
import { CallExpression, MemberExpression, program, Statement } from '@babel/types';
import traverse from '@babel/traverse';
import template from '@babel/template';
import generate from '@babel/generator';
import { Node } from '@babel/types';
import * as fs from 'fs';

const splitDeclaration = (traverseResult: TraverseResult): void => {

  const {file, modulePath} = traverseResult

  const node = modulePath.node;


  const fileTemplate = `
  'use strict';
  import _ from 'lodash';

  %%content%%

  export { %%contentId%% };

  `;

  const sourceTemplate = template(fileTemplate, {
    allowImportExportEverywhere: true
  });

  if (node.expression.type === "CallExpression") {
    const expression: CallExpression = node.expression;
    if (expression.arguments && expression.arguments.length > 0) {
      if(expression.callee.type == "MemberExpression") {
        const callee: MemberExpression = expression.callee;
        const callerName = callee.property['name'];

        if(callerName === "controller") {
          const argument = expression.arguments.length === 1 ? expression.arguments[0] : expression.arguments[1];
          let controllerName: string = "";
          if(argument.type === "StringLiteral") {
            controllerName = argument.value;
          } else if(argument.type === "Identifier") {
            controllerName = argument.name;
          }
          console.log('controllerName', controllerName);
          traverse(file, {
            FunctionDeclaration: function(xPath) {
              // jsonPrint('controller', xPath.node);
              if(xPath.isFunctionDeclaration() && xPath.node.loc && xPath.node.id && xPath.node.id.name === controllerName) {

                const code = generate((xPath.node as Node)).code

                const result = sourceTemplate({
                  content: code,
                  contentId: controllerName
                }) as Statement[];

                const p = program(result);
                const controllerContent = generate(p).code;
                fs.writeFileSync(`${controllerName.toLowerCase()}.component.ts`, controllerContent);
                console.log(controllerContent);
              }
            }
          })
        }
      }
    }
  }
};

export {splitDeclaration};
