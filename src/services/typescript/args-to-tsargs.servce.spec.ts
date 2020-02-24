import { argToTsArg } from './args-to-tsargs.servce';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as ts from 'typescript';

describe('ArgToTsArgService', () => {
  test('should convert a js argument to a ts argument', () => {
    const input = 'UserService';
    const result = argToTsArg(input);
    const expected = `private UserService: any`;

    const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    const printed = printer.printNode(ts.EmitHint.Unspecified, result, resultFile);
    expect(printed).toBe(expected);
  });
});
