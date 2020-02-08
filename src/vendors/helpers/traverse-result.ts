import { File, ExpressionStatement } from '@babel/types';
import { NodePath } from '@babel/traverse';

export interface TraverseResult{
  source: string;
  file: File;
  path: NodePath<ExpressionStatement>;
  mathingPath: NodePath
}
