import { createTestData, deleteTestData } from '../helpers/test.data';
import {expect, test} from '@oclif/test'

describe('DependenciesCommand', () => {
  const TEST_NAME = 'DependenciesCommand';
  let testDir = '';

  beforeEach(() => {
    try {
      deleteTestData(TEST_NAME);
    } catch (err) {
      console.log('err', err);
    }
    testDir = createTestData(TEST_NAME);
  });

  test
  .stdout()
  .command(['dependencies', '--project', testDir])
  .it(`runs dependencies --project ${testDir}`, ctx => {
    expect(ctx.stdout).to.contain('Started to import modules');
    // TODO: Assert that some modules have beeing imported
  })
})
