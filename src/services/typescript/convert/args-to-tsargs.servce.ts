
import * as ts from 'typescript';

const argToTsArg = (argId: string): ts.ParameterDeclaration => {
  const decorator = undefined;
  const modifier = [ts.createModifier(ts.SyntaxKind.PrivateKeyword)];
  const dotDotDotToken = undefined;
  const name = ts.createIdentifier(argId);
  const questionMaark = undefined;

  const type = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  const result = ts.createParameter(decorator, modifier, dotDotDotToken, name, questionMaark, type, undefined);
  return result;
};


export { argToTsArg };
