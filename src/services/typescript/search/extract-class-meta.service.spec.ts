import { ClassMeta } from '../class-meta.interface';
import { expectedClass } from '../../../helpers/test.data';
import { extractAllClassMetaInfos } from './extract-class-meta.service';

describe('ExtractClassMetaService', () => {

  test('should extract all class meta informations', () => {
    const result: ClassMeta = extractAllClassMetaInfos(expectedClass);
    expect(result).toBeTruthy();
    expect(result.assigmentVars).toBeTruthy();
    expect(result.constrParams).toBeTruthy();
    expect(result.classMethods).toBeTruthy();
    expect(result.initStatements).toBeTruthy();

    expect(result.assigmentVars?.length).toBe(3);
    expect(result.constrParams?.length).toBe(3);
    expect(result.classMethods?.length).toBe(1);
    expect(result.initStatements?.length).toBe(6);
  });
});
