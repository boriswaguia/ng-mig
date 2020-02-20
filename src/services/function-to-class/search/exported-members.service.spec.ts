import { searchExportedMembersIds } from './exported-members.service';
import { exampleFunction } from '../../../helpers/test.data';
import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';

describe('ExportedMemebersService', () => {

  test('should return exported members ids', () => {
    const expected = ['UserController'];
    const result = searchExportedMembersIds(parseSourceTypeModule(exampleFunction));
    expect(result).toEqual(expected);
  });
});
