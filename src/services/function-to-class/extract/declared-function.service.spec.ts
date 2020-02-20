import { searchExportedFunction } from '../search/exported-function.service';
import { exampleFunction } from '../../../helpers/test.data';
import { extractDeclaredFunctions } from './declared-function.service';

describe('DeclaredFunctionService', () => {

  test('should return declared functions', () => {
    const input = searchExportedFunction(exampleFunction)[0];
    const results = extractDeclaredFunctions(input);
    expect(results.length).toBe(1);
  });
});
