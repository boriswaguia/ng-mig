import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import { findModule } from '../../../vendors/helpers/traverse.helper';
import {File, MemberExpression, Identifier, ImportDeclaration, ImportSpecifier} from '@babel/types';
import traverse from '@babel/traverse';
import { ModuleConfg } from './module-config.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { annotateCanditates } from '../annotate-candidates';
import { TraverseResultExpressionStatement } from '../../../vendors/helpers/traverse-result';
import { FoundImport } from './found-import';

const contains = (array: string[], search: string) => array.find(elt => elt === search) != undefined

const searchModuleToProcess = (r: TraverseResultExpressionStatement) => {

  const identifiers: string[] = [];
  traverse(r.modulePath.node, {
    noScope: true,
    CallExpression: function(xPath) {
      const node = xPath.node;
      const callArguments = node.arguments;
      const callerName = ((node.callee as MemberExpression).property as Identifier).name;
      if (contains(annotateCanditates, callerName) && callArguments.length == 2) {
        identifiers.push((callArguments[1] as Identifier).name);
      }
    }
  });
  return identifiers;
}

const getImportDeclarations = (file: File): ImportDeclaration[] => {
  let results: ImportDeclaration[] = [];
  traverse(file, {
    ImportDeclaration: function(xPath) {
      results.push(xPath.node);
    }
  });
  return results;
};

const filterImport = (importDeclarations: ImportDeclaration[], moduleToProcess: string[]): FoundImport[] => {
  const result: FoundImport[] = [];
  importDeclarations.forEach(importDeclaration => {
    const specifiers = importDeclaration.specifiers
      .map(s => s as ImportSpecifier)
      .filter(s => contains(moduleToProcess, (s.local as Identifier).name));
      const mapped = specifiers.map(s => ({source: importDeclaration.source, specifier: s} as FoundImport));
      result.push(...mapped);
  });
  return result;
};

const searchModuleConfigs = (content: string): Observable<ModuleConfg[]> => {

  // 1. search angular.module expression statement
  // 2. search .config, .factory, .service. identifiers
  // 3. get list of imports statements
  // 4. filter imports statements that are in identifiers list
  // 5. map to Module config
  // 6. return

  const file: File = parseSourceTypeModule(content);
  //1.
  const sourceTypeModule = true;
  return findModule(content, 'angular.module', sourceTypeModule).pipe(
    map(angularExpressionStmt => {
      // 2
      const moduleToProcess = searchModuleToProcess(angularExpressionStmt);
      // 3
      const importDeclarations = getImportDeclarations(file);
      // 4
      const eligibleImports = filterImport(importDeclarations, moduleToProcess);
      // 5
      const results: ModuleConfg[] = eligibleImports.map(e => ({source: e.source, specifier: e.specifier} as ModuleConfg));
      return results;
    })
  );
};

export {searchModuleConfigs};
