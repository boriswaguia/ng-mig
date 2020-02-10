import {expect, test} from '@oclif/test'

describe('split', () => {

  test
  .stdout()
  .command(['split', '--project', '/Users/bwa/dev/opensource/bwa/akSkeleton'])
  .it('runs split --project /Users/bwa/dev/opensource/bwa/akSkeleton', ctx => {
    expect(ctx.stdout).to.contain('Finished extracting')
  })
})
