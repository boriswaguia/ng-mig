import { convertFunctionToClassMethods } from './function-to-class-method.service';
import { exampleFunction } from '../../../helpers/test.data';
import generate from '@babel/generator';
import { extractDeclaredFunctions } from '../extract/declared-function.service';
import { searchExportedFunction } from '../search/exported-function.service';

describe('FunctionToClassMethodService', () => {

  test('should convert function to class methods', () => {
    const inputs = extractDeclaredFunctions(searchExportedFunction(exampleFunction)[0]);
    const results = convertFunctionToClassMethods(inputs);
    expect(results.length).toBe(1);
  });
});
