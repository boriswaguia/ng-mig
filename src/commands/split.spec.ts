import {expect, test} from '@oclif/test'
import { createTestData, deleteTestData } from '../helpers/test.data';

describe('SplitCommand', () => {
  const TEST_NAME = 'SplitCommand';
  let testDir = '';

  beforeEach(() => {
    testDir = createTestData(TEST_NAME);
  });

  test
  .stdout()
  .command(['split', '--project', testDir])
  .it(`runs split --project ${testDir}`, ctx => {
    expect(ctx.stdout).to.contain('Finished extracting')
  })

  afterEach(() => {
    deleteTestData(TEST_NAME);
  });
})
