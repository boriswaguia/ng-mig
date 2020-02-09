import { findModule } from '../../vendors/helpers/traverse.helper';
import { ModulePattern, ANGULAR_JS_MODULE_PATTERN } from './module.type';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


const hasModule = (source: string, moduleName: ModulePattern): Observable<boolean> => {
  return findModule(source, moduleName.valueOf()).pipe(
    map(_ => true)
  );
}

const hasAngularJsModule = (source: string) => hasModule(source, ANGULAR_JS_MODULE_PATTERN);

const extractModuleDeclaration = (source: string) => findModule(source, ANGULAR_JS_MODULE_PATTERN.valueOf())
export {hasModule, hasAngularJsModule, extractModuleDeclaration};
