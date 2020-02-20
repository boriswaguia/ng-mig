import { exampleFunction } from '../../../helpers/test.data';
import { searchExportedFunction } from './exported-function.service';

describe('ExportedFunctionService', () => {

  test('search and return exported function', () => {
    const result = searchExportedFunction(exampleFunction);
    expect(result.length).toBe(1);
    expect(result[0]).toBeTruthy();
  });
});
