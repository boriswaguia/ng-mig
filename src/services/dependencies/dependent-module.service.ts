import { FilePath, FolderPath } from '../split/module.type';
import { openFile } from '../../vendors/helpers/file.helper';
import { findModuleCallExpression } from '../../vendors/helpers/traverse.helper';
import { Observable, of, forkJoin } from 'rxjs';
import { map as maprx, map, filter, flatMap } from 'rxjs/operators';
import { CallExpression } from '@babel/types';
import traverse from "@babel/traverse";
import { getSourceFiles } from '../../vendors/helpers/dirwalk.helper';
import { relativeImportPath } from '../../vendors/helpers/relative.helper';
import * as parser from "@babel/parser";
const insertLine = require('insert-line');

export interface BasicModule {
  id: string,
  required: string[],
  filePath: string
}

const extractBasicModule = (file: FilePath): Observable<BasicModule> => {
  const source = openFile(file);
  const __defaultModule: BasicModule = { id: '', required: [], filePath: file};
  // fast check if there exist and angular.module declaration in this file and exist quickly if not
  if (!source.includes('angular.module')) {
    return of(__defaultModule);
  }

  return findModuleCallExpression(openFile(file)).pipe(
    maprx(r => {
      const args = (r.matchingPath.node as CallExpression).arguments;

      if (args.length === 0 ) {
        return __defaultModule;
      }

      if (args.length === 1 && args[0].type === "StringLiteral") {
        return {id: args[0].value, required: [], filePath: file};
      }

      if (args.length === 2 && args[0].type === "StringLiteral" && args[1].type === "ArrayExpression") {
        const depModules = args[1].elements.map(x => x?.type === "StringLiteral" ? x.value : "found-no-string-litteral");
        return {id: args[0].value, required: depModules, filePath: file};
      }
      return __defaultModule;
    })
  )
};

const extractFilesDependenciesList = (files: FilePath[]): Observable<Map<string, BasicModule>> => {
    const obs: Observable<BasicModule>[] = [];
    files.forEach(f => obs.push(extractBasicModule(f)));
    return forkJoin(obs).pipe(
      map(modules => {
        const moduleRegistry = new Map<string, BasicModule>();
        modules.filter(x => !!x.id).forEach(x => moduleRegistry.set(x.id, x));
        return moduleRegistry;
      })
  );
}


const extractFolderDependenciesList = (folder: FolderPath): Observable<Map<string, BasicModule>> => {
  return extractFilesDependenciesList(getSourceFiles(folder))
}

const importModules = (filePath: FilePath, registry: Map<string, BasicModule>): Observable<string> => {

  return extractBasicModule(filePath).pipe(
    filter(basicModule => basicModule.id.length >= 0),
    map(basicModule => {
      const importStatments: string[] = [];
      basicModule.required.forEach(dependencyId => {
        const mFilePath = basicModule.filePath;
        const dependencyFilePath = registry.get(dependencyId)?.filePath;
        if (dependencyFilePath) {
          const importPath = relativeImportPath(mFilePath, dependencyFilePath);
          importStatments.push(`import '${importPath}';`);
        }
      });

      if (importStatments.length > 0) {
        const fileD = parser.parse(openFile(basicModule.filePath), {
          sourceType: 'module'
        });

        traverse(fileD, {
          MemberExpression: function(expressionPath) {
            // Search where the user has declared angular.module
            if (expressionPath.node.object.type === "Identifier" && expressionPath.node.object.name === "angular") {
              const line = expressionPath.node.loc?.start.line;
              if (line) {
                insertLine(basicModule.filePath).contentSync(importStatments.join('\n')).at(line);
              }
            }
          }
        })
      }
      return openFile(basicModule.filePath);
    })
  )
};

const importModulesForFiles = (files: FilePath[], registry: Map<string, BasicModule>) => {
  return files.map(f => importModules(f, registry));
};

const importModulesForFolder = (folder: FolderPath) => {
  return extractFolderDependenciesList(folder).pipe(
    flatMap(registry => importModulesForFiles(getSourceFiles(folder), registry))
  )
}

export { extractBasicModule, extractFilesDependenciesList, extractFolderDependenciesList, importModules, importModulesForFolder };
