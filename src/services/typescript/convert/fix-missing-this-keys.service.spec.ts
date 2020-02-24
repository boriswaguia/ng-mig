import { createTsClass } from './create-ts-class.service';
import { extractAllClassMetaInfos } from '../search/extract-class-meta.service';
import { expectedClass } from '../../../helpers/test.data';
import { extractDeclaredIds } from '../search/declared-identifiers.service';
import { fixMissingThisKeys } from './fix-missing-this-keys.service';
import generate from '@babel/generator';

describe('FixMissingThisKeyService', () => {

  test('should fix all variable and reference key', () => {
    const availableVariables = extractDeclaredIds(expectedClass);
    const classDeclaration = createTsClass(extractAllClassMetaInfos(expectedClass));
    const code = generate(classDeclaration).code;
    console.log('---code---', code);
    const result = fixMissingThisKeys(classDeclaration, availableVariables);
    const gcode = generate(result).code;
    console.log('-----gcode----', gcode);
    expect(result).toBeTruthy();
  });
});
