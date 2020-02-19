import { parseSourceTypeModule } from '../../../vendors/helpers/code-parser.helper';
import { findModule } from '../../../vendors/helpers/traverse.helper';
import {File, MemberExpression, Identifier, ImportDeclaration, ImportSpecifier} from '@babel/types';
import traverse from '@babel/traverse';
import { ModuleConfig } from './module-config.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { annotateCanditates } from '../annotate-candidates';
import { TraverseResultExpressionStatement } from '../../../vendors/helpers/traverse-result';
import { FoundImport } from './found-import';
import { contains } from '../../../helpers/array.helper';

/**
 * Givent the following expression:
 *
 *  angular.module('module.name', [])
 *     .factory('UserService', UserService).
 *     .factory('UserController', UserController)
 *     .constant('APP_URL', APP_URL)
 *
 * should return:
 *  ['UserService', 'UserController']
 *
 * @param r
 * @returns Array<string>
 */
const searchModuleToProcess = (r: TraverseResultExpressionStatement) => {

  const identifiers: string[] = [];
  traverse(r.modulePath.node, {
    noScope: true,
    CallExpression: function(xPath) {
      const node = xPath.node;
      const callArguments = node.arguments;
      const callerName = ((node.callee as MemberExpression).property as Identifier).name;
      if (contains(annotateCanditates, callerName)) {
        const serviceName = callArguments.length > 1 ? (callArguments[1] as Identifier).name: (callArguments[0] as Identifier).name
        identifiers.push(serviceName);
      }
    }
  });

  console.log('identifiers', identifiers);
  return identifiers;
}

/**
 * Read a given javascript script and return the list of imports.
 *
 * Given the following:
 *  import { ABX } from './folder/fileabx'
 *  import { ABY } from './folder/filen-aby'
 *
 * Should return and array of those two imports statements
 *
 * @param file File
 */
const getImportDeclarations = (file: File): ImportDeclaration[] => {
  let results: ImportDeclaration[] = [];
  traverse(file, {
    ImportDeclaration: function(xPath) {
      results.push(xPath.node);
    }
  });
  return results;
};

/**
 * Given the following imports:
 *
 *  import { ABX } from './folder/file-abx'
 *  import { ABY } from './folder/file-aby'
 *  import { ABZ } from './folder/file-abz'
 * and
 *  ['ABX', 'ABZ']
 *
 * Then calling this function should return the followings items:
 *  [{source: './folder/file-abx', specifier: ABX}, {source: './folder/file-aby', specifier: ABY}]
 *
 * @param importDeclarations All import from a source fee. @see getImportDeclarations
 * @param moduleToProcess List of all modules that need angular annotation injection. @see searchModuleToProcess
 */
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

/**
 *
 * Scan a source file and return angularjs configs that need annotations.
 *
 * @param content code source to process
 */
const searchModuleConfigs = (content: string): Observable<ModuleConfig[]> => {

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
      const results: ModuleConfig[] = eligibleImports.map(e => ({source: e.source, specifier: e.specifier} as ModuleConfig));
      return results;
    })
  );
};

export {searchModuleConfigs};
