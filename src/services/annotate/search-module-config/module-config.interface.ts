import { ImportSpecifier, StringLiteral } from '@babel/types';

export interface ModuleConfig {
  specifier: ImportSpecifier,
  source: StringLiteral,
};
