import { exampleFunction } from '../../helpers/test.data';
import { parseToTypescript } from './generate-type-script.service';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as ts from 'typescript';
import { getCode } from './helper/ts-node-to-tocode.helper';

describe('GenerateTypescriptService', () => {

  // test('It should generate typescript data', () => {
  //   const src = `
  //   class UserService {

  //   }
  //   `

  //   const expected = `
  //   class User{
  //     private vm: any;
  //     private name: any;
  //     private address: any;

  //     constructor(name: any, address: any) {
  //       this.vm = this;
  //       this.name = name;
  //       this.address = address;
  //       printUserName();
  //     }
  //     printUserName() {
  //       console.log(this.vm.name);
  //     }
  //   }
  //   `;
  //   const result = parseToTypescript(src);
  //   expect(result).toBe(expected);
  // });

  test('shoud return private field', () => {
    const decorators = undefined;
    const modifiers = [ts.createModifier(ts.SyntaxKind.PrivateKeyword)];
    const questionOrExclamation = undefined;
    const type = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    const property  = ts.createProperty(decorators, modifiers, 'username', questionOrExclamation, type, undefined);
    const text = getCode(property);
    const expected = 'private username: any;';
    expect(text).toBe(expected);
  });
});
