import { argToTsArg } from './args-to-tsargs.servce';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as ts from 'typescript';
import { getCode } from '../helper/ts-node-to-tocode.helper';

describe('ArgToTsArgService', () => {
  test('should convert a js argument to a ts argument', () => {
    const input = 'UserService';
    const result = argToTsArg(input);
    const expected = `private UserService: any`;
    const printed = getCode(result);
    expect(printed).toBe(expected);
  });

});
