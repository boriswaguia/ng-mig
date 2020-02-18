import { File, ExpressionStatement, CallExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';

interface TraverseResult {
  source: string;
  file: File;
  matchingPath: NodePath // the angular.module
}

export interface TraverseResultExpressionStatement extends TraverseResult {
  modulePath: NodePath<ExpressionStatement>; // The expression statement angular module configuration expression
}

export interface TraverseResultCallExpression extends TraverseResult{
  modulePath: NodePath<CallExpression>;
}
