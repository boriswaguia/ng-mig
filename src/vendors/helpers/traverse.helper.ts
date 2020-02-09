import {Observable, of, Observer} from 'rxjs';
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { matchesPattern } from '@babel/types';
import { TraverseResult } from './traverse-result';


const findModule = (source: string, modulePattern: string): Observable<TraverseResult> => {

  return Observable.create((observer: Observer<TraverseResult>) => {

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
                const result: TraverseResult = {source, file, modulePath, matchingPath: path2};
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

export { findModule, parser };
