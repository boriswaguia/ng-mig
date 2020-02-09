import { hasModule, extractModuleDeclaration } from './module.service';
import { source } from '../../helpers/test.data';
describe("ModuleService", () => {
  const ANGULAR_JS_MODULE = 'angular';


  test('should have module', (done) => {

    const result = hasModule(source, ANGULAR_JS_MODULE);
    result.subscribe(r => {
      expect(r).toBeTruthy();
      done();
    })
  });

  test('should extract existing module', (done) => {
    const result = extractModuleDeclaration(source);
    result.subscribe(r => {
      expect(result).toBeTruthy();
      done();
    })
  });

});
