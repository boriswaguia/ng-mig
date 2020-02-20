import { exampleFunction, expectedClass } from '../../helpers/test.data';
import { convertToClass } from './function-to-class.service';
import generate from '@babel/generator';

describe('FunctionToClassService', () => {

  test('should convert a given function to an es6 class', () => {
    const result = convertToClass(exampleFunction);
    const code = generate(result).code;
    console.log('-------------code------------', code);
    expect(code).toEqual(expectedClass);
  });
});
