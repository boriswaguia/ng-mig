import { deleteTestData, createTestData } from '../../helpers/test.data';
import { listReferencedNodes } from './referenced-nodes.service';

describe('ReferencedNodesService', () => {

  const TEST_NAME = 'ReferencedNodesService';
  let testDir = '';
  beforeEach(() => {
    console.log('before');
    try {
      deleteTestData(TEST_NAME);
    } catch (err) {
      console.log('error', err);
    }
    testDir = createTestData(TEST_NAME);
  });


  test('should list all referenced nodes', () => {

    const filePath = testDir+'/src/app/special-cases/module-has-unused-function.js';
    const result = listReferencedNodes(filePath);
    expect(result).toBe(4);
  });

});
