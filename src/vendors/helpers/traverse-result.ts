import { File, ExpressionStatement, CallExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';

interface TraverseResult {
  source: string;
  file: File;
  matchingPath: NodePath
}

export interface TraverseResultExpressionStatement extends TraverseResult {
  modulePath: NodePath<ExpressionStatement>;
}

export interface TraverseResultCallExpression extends TraverseResult{
  modulePath: NodePath<CallExpression>;
}
