import { astParser } from './ast.helper';

describe('acorn', () => {
  it('should parse javascript file to ast', () => {
    let source = `
        class Foo {
            foo () {
                const bar = "quux"
                let baz = 42
            }
        }
    `

    // let expected: Node = {
    //   type: 'Program',
    //   start: 0,
    //   end: 134,
    //   body:
    //    [ Node {
    //        type: 'ClassDeclaration',
    //        start: 9,
    //        end: 129,
    //        id: [Node],
    //        superClass: null,
    //        body: [Node] } ],
    //   sourceType: 'script' }

    const ast = astParser.parse(source);
    console.log('..............................ast..............................', ast)
    expect(ast).toBeTruthy();
  });
});
