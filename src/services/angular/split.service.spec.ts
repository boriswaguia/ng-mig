import { TraverseResult } from '../../vendors/helpers/traverse-result';
import { extractModuleDeclaration } from './module.service';
import { source } from '../../helpers/test.data';

import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { splitDeclaration } from './split.service';

describe('ModuleSplitService', () => {
  test('should extract four files with from a given module', (done) => {
    const traverseResult = extractModuleDeclaration(source);
    traverseResult.subscribe(r => {
      splitDeclaration(r, 'testdata/src');
      // expect(result).toHaveLength(4)
      done();
    })
  });

  // test('Should generate content', () => {

  //   const buildRequire = template(`
  //   var %%importName%% = require(%%source%%);
  //   `);

  //   const constantTemplate = `
  //   %%codeContent%%

  //   export { %%identifier%% };

  //   `;

  //   const ast = buildRequire({
  //     importName: t.identifier("myModule"),
  //     source: t.stringLiteral("my-module"),
  //   }) as t.Node;

  //   console.log(generate(ast).code);
  // })
});
