import { asqtHelper } from "./astq.helper";
import { astParser } from "./ast.helper";

describe("ASQT", () => {
  it("should find arguments", () => {
    let source = `
        class Foo {
            foo () {
                const bar = "quux"
                let baz = 42
            }
        }
    `;
    let ast = astParser.parse(source);

    const result = asqtHelper.query(
      ast,
      `
        // VariableDeclarator [
              /:id   Identifier [ @name  ]
            && /:init Literal    [ @value ]
        ]
    `
    );
    // .forEach(function (node: any) {
    //   console.log(`${node.id.name}: ${node.init.value}`)
    // })

    // const expected = [ Node {
    //   type: 'VariableDeclarator',
    //   start: 64,
    //   end: 76,
    //   id: Node { type: 'Identifier', start: 64, end: 67, name: 'bar' },
    //   init:
    //    Node {
    //      type: 'Literal',
    //      start: 70,
    //      end: 76,
    //      value: 'quux',
    //      raw: '"quux"' } },
    // Node {
    //   type: 'VariableDeclarator',
    //   start: 97,
    //   end: 105,
    //   id:
    //    Node { type: 'Identifier', start: 97, end: 100, name: 'baz' },
    //   init:
    //    Node { type: 'Literal', start: 103, end: 105, value: 42, raw: '42' } } ]
    expect(result).toBeTruthy();
  });
});
