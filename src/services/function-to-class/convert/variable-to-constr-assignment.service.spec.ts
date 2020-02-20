import { extractRootVariableDeclarations } from '../extract/root-scope-variable-declaration.service';
import { searchExportedFunction } from '../search/exported-function.service';
import { exampleFunction } from '../../../helpers/test.data';
import { convertVarToAssigments } from './variable-to-constr-assignment.service';
import generate from '@babel/generator';

describe('VariableToConstrAssigmentService', () => {

  test('should convert function var declarations to constructors assigment statements', () => {

    const input = searchExportedFunction(exampleFunction)[0];
    const vars = extractRootVariableDeclarations(input);
    const results = convertVarToAssigments(vars);
    expect(results.length).toBe(3);
  });
});
