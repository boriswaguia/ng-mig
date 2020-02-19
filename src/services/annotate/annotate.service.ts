import { FilePath, FolderPath } from '../split/module.type';
import { openFile, writeFileSync } from '../../vendors/helpers/file.helper';
import { searchModuleConfigs } from './search-module-config/search-module-config.service';
import { searchRequiredServices } from './search-required-services/search-required-services';
import { ModuleConfig } from './search-module-config/module-config.interface';
import { mapModuleToQuery } from './search-required-services/map-module-config-to-service-query';
import { ArrayExpression } from '@babel/types';
import * as bbt from "@babel/types";
import traverse from '@babel/traverse';
import { findModule } from '../../vendors/helpers/traverse.helper';
import { map } from 'rxjs/operators';
import generate from "@babel/generator";
import { contains } from '../../helpers/array.helper';
import { annotateCanditates } from './annotate-candidates';
import { getSourceFiles } from '../../vendors/helpers/dirwalk.helper';
import { from } from 'rxjs';
import { jsonPrint } from '../../helpers/print.helper';
import { map_to_object } from '../../helpers/map.helper';


interface ConfigAndService {
  elementId: string,
  config: ModuleConfig,
  services: string[]
}

type ConfigServiceMap = Map<string, ConfigAndService>;

const createImportedConfigServices = (moduleConfigs: ModuleConfig[], filePath: FilePath) => {
  const configServiceMap = new Map<string, ConfigAndService>();

  moduleConfigs.forEach(config => {
    const query = mapModuleToQuery(config);
    const services = searchRequiredServices(query, filePath);
    configServiceMap.set(query.elementId, {elementId: query.elementId, config, services});
  });
  return configServiceMap;
};


const createArrayStatement = (key: string, services: string[]) => {
  const elts: bbt.Expression[] = []
  services.forEach(service => elts.push(bbt.stringLiteral(service)));
  elts.push(bbt.identifier(key));
  const arrayExpression = bbt.arrayExpression(elts);
  return arrayExpression;
};

const createAnnotationStatmentsForModules = (configServiceMap: ConfigServiceMap) => {
  const result = new Map<string, ArrayExpression | bbt.Identifier>();
  configServiceMap.forEach((val, key) => {
    const statement = val.services.length >= 1 ? createArrayStatement(key, [...val.services]) : bbt.identifier(key);
    result.set(key, statement);
  });
  return result;
};

const getClassOrFunctionName = (node: bbt.CallExpression) => {
  let classOrFunctionName = '';
  if(node.arguments.length === 1 && bbt.isIdentifier(node.arguments[0])) {
    classOrFunctionName = node.arguments[0].name;
  } else if(node.arguments.length === 2 && bbt.isStringLiteral(node.arguments[0])) {
    classOrFunctionName = (node.arguments[0] as bbt.StringLiteral).value;
  }
  return classOrFunctionName;
}

const updateModuleWithAnnotations = (filePath: FilePath, annotations: Map<string, ArrayExpression | bbt.Identifier>) => {

  // 1. search angular.module declaration
  // 2. search each services with id
  // 3. get arguments
  // 4. replace the second argument identifier with the ArrayExpression from the map
  // 5. generate a new source code
  // 6. return

  return findModule(openFile(filePath), 'angular.module', true).pipe(
    map(r => {
      traverse(r.modulePath.node, {
        noScope: true,
        CallExpression: function(xPath) {
          const node = xPath.node;
          const callerName = ((node.callee as bbt.MemberExpression).property as bbt.Identifier).name;
          const shouldBeProcessed = contains(annotateCanditates, callerName);
          const classOrFunctionName = getClassOrFunctionName(node);
          if (shouldBeProcessed && annotations.get(classOrFunctionName) && node.arguments.length === 1) {
            console.log(`----changed--- ${classOrFunctionName}`);
            node.arguments[0] =  annotations.get(classOrFunctionName)!;
          } else if (shouldBeProcessed && annotations.get(classOrFunctionName) && node.arguments.length === 2) {
            console.log(`----changed--- ${classOrFunctionName}`);
            node.arguments[1] = annotations.get(classOrFunctionName)!;
          } else {
            console.log('nothing found for  ----', classOrFunctionName);
          }
        }
      });
      return r.file;
    })
  )
};

const annotateModule = async (filePath: FilePath) => {
  // 1. open file
  // 2. search module configs
  // 3. for imported module, search all the services they need
  // 4. create new array configs
  // 5. update angular module declaration expression
      const content = openFile(filePath);
      const moduleConfigs = await searchModuleConfigs(content).toPromise();
      // console.log(`${filePath} - ${jsonPrint('', moduleConfigs)}`);
      const configServiceMap = createImportedConfigServices(moduleConfigs, filePath);

      // console.log(`${filePath} ----- `, jsonPrint('---------file----', map_to_object(configServiceMap)));

      const annotationExpressions = createAnnotationStatmentsForModules(configServiceMap);
      const newContentFile =  await updateModuleWithAnnotations(filePath, annotationExpressions).toPromise();
      const { code } = generate(newContentFile);
      return code;
};

const annotateFolder = (folderPath: FolderPath) => {
  const modules = getSourceFiles(folderPath);
  console.log('modules', modules);
  modules.forEach(filePath => {
    console.log('---annotateModule---', filePath);
    from(annotateModule(filePath)).subscribe( code =>{
      // console.log(`file ${filePath} ---- ${code}`);
      writeFileSync(filePath, code);
      console.log(`----annotation finished----`);
    }, err => {
      console.log(`---ERROR--- ${err}`);
    });
  });
};


export { annotateModule, createArrayStatement, annotateFolder };
