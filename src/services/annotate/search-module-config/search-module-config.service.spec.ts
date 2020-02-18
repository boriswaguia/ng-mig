import { ModuleConfig } from './module-config.interface';
import { moduleExample, moduleImportDeclarationJson } from '../../../helpers/test.data';
import { searchModuleConfigs } from './search-module-config.service';

describe('SearchModuleConfigService', () => {

  test('should return array of module configs for annotation', async () => {
    const expected: ModuleConfig[] = JSON.parse(moduleImportDeclarationJson);
    const results = await searchModuleConfigs(moduleExample).toPromise();
    expect(results).toEqual(expected);
  });
});
