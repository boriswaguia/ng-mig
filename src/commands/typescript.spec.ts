import { createTestData, deleteTestData } from '../helpers/test.data';
import {expect, test} from '@oclif/test'

describe('TypescriptCommand', () => {
  const TEST_NAME = 'TypescriptCommand';
  let testDir = '';


  test
  .stdout()
  .command(['typescript', '--project', testDir])
  .it(`runs annotate --project ${testDir}`, ctx => {
    expect(ctx.stdout).to.contain('Started parsing to ts files');
    // TODO: Assert that some modules have beeing annotated
  })
})
