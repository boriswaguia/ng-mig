import { Literal, ImportSpecifier } from '@babel/types';

export interface FoundImport {
  specifier: ImportSpecifier,
  source: Literal
}
