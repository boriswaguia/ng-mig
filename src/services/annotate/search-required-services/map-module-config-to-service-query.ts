import { ModuleConfig } from '../search-module-config/module-config.interface';
import { ServiceQuery } from './service-query';

const mapModuleToQuery = (moduleConfig: ModuleConfig) => ({
  elementId: moduleConfig.specifier.local.name,
  importPath: moduleConfig.source.value
} as ServiceQuery);

const mapModuleListToQueries = (moduleConfigs: ModuleConfig[]) => moduleConfigs.map(x => mapModuleToQuery(x))

export { mapModuleToQuery, mapModuleListToQueries };
