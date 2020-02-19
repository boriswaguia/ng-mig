import { createTestData, deleteTestData } from '../helpers/test.data';
import {expect, test} from '@oclif/test'

describe('AnnotateCommand', () => {
  const TEST_NAME = 'AnnotateCommand';
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
  .command(['annotate', '--project', testDir])
  .it(`runs annotate --project ${testDir}`, ctx => {
    expect(ctx.stdout).to.contain('Started to annotate modules');
    // TODO: Assert that some modules have beeing annotated
  })
})
