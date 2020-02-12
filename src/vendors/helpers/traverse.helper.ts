import {Observable, of, Observer} from 'rxjs';
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { matchesPattern, Identifier } from '@babel/types';
import { TraverseResultExpressionStatement, TraverseResultCallExpression } from './traverse-result';


const findModule = (source: string, modulePattern: string): Observable<TraverseResultExpressionStatement> => {

  return Observable.create((observer: Observer<TraverseResultExpressionStatement>) => {

    const file = parser.parse(source);

    traverse(file, {
      ExpressionStatement: function(modulePath) {

        traverse(
          modulePath.node,
          {
            noScope: true,
            enter(path2: NodePath) {
              const matchesPatter = matchesPattern(path2.node, modulePattern, true)
              if (matchesPatter && modulePath.node && modulePath.node.start && modulePath.node.start > 0) {
                const result: TraverseResultExpressionStatement = {source, file, modulePath, matchingPath: path2};
                observer.next(result);
                observer.complete();
              }
            }
          }
        );
      }
    });
    observer.error('nothing found');
  });
}

const findCallExpression = (source: string, calleeId: string): Observable<TraverseResultCallExpression> => {
  return Observable.create((observer: Observer<TraverseResultCallExpression>) => {
    const file = parser.parse(source, {
      sourceType: 'module'
    });
    traverse(file, {
      CallExpression: function(modulePath) {
        const callee = modulePath.node.callee;
        if (callee.type === "MemberExpression" && (callee.property as Identifier).name === calleeId) {
          const result: TraverseResultCallExpression = { source, file, modulePath, matchingPath: modulePath}
          observer.next(result);
          observer.complete();
        }
      }
    })
    observer.error('nothing found');
  });
}

const findModuleCallExpression = (source: string) => findCallExpression(source, 'module');

export { findModule, parser, findModuleCallExpression };
