import { findModule, findModuleCallExpression } from './traverse.helper';
import { source } from '../../helpers/test.data';

describe("TransveralHelper", () => {
  test("should traverse", (done) => {
    const result = findModule(source, 'angular.module');
    result.subscribe(r => {
      expect(r).toBeTruthy();
      expect(r.file).toBeTruthy();
      expect(r.matchingPath).toBeTruthy();
      expect(r.modulePath).toBeTruthy();
      expect(r.source).toBeTruthy();
      done();
    }, err => console.log(err));
  });

  test('should find .module call expression', (done) => {
    const result = findModuleCallExpression(source);
    result.subscribe(r => {
      expect(r.file).toBeTruthy();
      expect(r.matchingPath).toBeTruthy();
      expect(r.modulePath).toBeTruthy();
      expect(r.source).toBeTruthy();
      expect(r.modulePath).toEqual(r.matchingPath);
      done();
    }, err => console.log('err', err));
  });

});
