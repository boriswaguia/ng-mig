import { expectedClass } from '../../../helpers/test.data';
import { extractDeclaredIds } from './declared-identifiers.service';

describe('DeclaredIdentifierService', () => {

  test('should return list of all class declared identifiers', () => {
    const results = extractDeclaredIds(expectedClass);
    expect(results.length).toBe(7);
  });
});
