import { searchExportedFunction } from '../search/exported-function.service';
import { exampleFunction } from '../../../helpers/test.data';
import { extractRootVariableDeclarations } from './root-scope-variable-declaration.service';

describe('RootScopeVariableDeclarationService', () => {

  test('should extract and return all root variables declarations of the function', () => {
    const input = searchExportedFunction(exampleFunction)[0];
    const results = extractRootVariableDeclarations(input);
    expect(results.length).toBe(3);
  });
});
