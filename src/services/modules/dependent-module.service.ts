import { FilePath, FolderPath } from '../split/module.type';
import { openFile } from '../../vendors/helpers/file.helper';
import { findModuleCallExpression } from '../../vendors/helpers/traverse.helper';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { map as maprx, map, filter } from 'rxjs/operators';
import { CallExpression } from '@babel/types';
import { jsonPrint } from '../../helpers/print.helper';
import { getSourceFiles } from '../../vendors/helpers/dirwalk.helper';

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

const extractFilesDependenciesList = (files: FilePath[]) => {
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


const extractFolderDependenciesList = (folder: FolderPath) => {
  return extractFilesDependenciesList(getSourceFiles(folder))
}
export { extractBasicModule, extractFilesDependenciesList, extractFolderDependenciesList };
