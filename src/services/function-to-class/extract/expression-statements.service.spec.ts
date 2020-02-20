import { searchExportedFunction } from '../search/exported-function.service';
import { exampleFunction } from '../../../helpers/test.data';
import { extractDirectInnerExpressionStatements } from './expression-statements.service';

describe('ExpressionStatementService', () => {
  test('extract direct inner expressions statements', () => {
    const input = searchExportedFunction(exampleFunction)[0];
    const results = extractDirectInnerExpressionStatements(input);
    expect(results.length).toBe(3);
  });
});
