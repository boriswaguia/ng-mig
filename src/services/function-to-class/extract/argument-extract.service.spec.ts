import { searchExportedFunction } from '../search/exported-function.service';
import { exampleFunction } from '../../../helpers/test.data';
import { extractArgumentsIds } from './argument-extract.service';

describe('ArgumentExtractService', () => {


  test('should extract arguments of a function', () => {
    const input = searchExportedFunction(exampleFunction)[0];
    const result = extractArgumentsIds(input);
    expect(result.length).toBe(3);
  });
});
