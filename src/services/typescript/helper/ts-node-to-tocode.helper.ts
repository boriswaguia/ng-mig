import * as ts from 'typescript';

const getCode = (result: ts.Node) => {
  const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const code = printer.printNode(ts.EmitHint.Unspecified, result, resultFile);
  return code;
}

  export { getCode };
