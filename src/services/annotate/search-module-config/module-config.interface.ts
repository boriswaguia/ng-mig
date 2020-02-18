import { ImportSpecifier, Literal } from '@babel/types';

export interface ModuleConfg {
  specifier: ImportSpecifier,
  source: Literal,
};
