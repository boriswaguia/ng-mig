import {Observable, of, Observer} from 'rxjs';
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { matchesPattern } from '@babel/types';
import { TraverseResult } from './traverse-result';


const findModule = (source: string, modulePattern: string): Observable<TraverseResult> => {

  return Observable.create((observer: Observer<TraverseResult>) => {

    const file = parser.parse(source);

    traverse(file, {
      ExpressionStatement: function(path) {

        traverse(
          path.node,
          {
            noScope: true,
            enter(path2: NodePath) {
              const matchesPatter = matchesPattern(path2.node, modulePattern, true)
              if (matchesPatter && path.node && path.node.start && path.node.start > 0) {
                // cb.handle(code, ast, path, path2);
                const result: TraverseResult = {source, file, path, mathingPath: path2};
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

export {findModule};
