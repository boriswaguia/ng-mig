import { expectedTsClass, expectedClass } from '../../../helpers/test.data';
import { extractAllClassMetaInfos } from '../search/extract-class-meta.service';
import { createTsClass } from './create-ts-class.service';
import generate from '@babel/generator';

describe('CreateTSClassService', () => {

  test('should return a ts source code given a class AST meta', () => {
    const classMeta = extractAllClassMetaInfos(expectedClass);
    const result = createTsClass(classMeta);

    const code = generate(result).code;
    expect(code).toEqual(expectedTsClass);
  });

});
