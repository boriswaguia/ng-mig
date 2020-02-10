import { getSourceFiles } from '../vendors/helpers/dirwalk.helper';
import { processFile } from './process-file.service';

describe('ProcessFileService', () => {
test('should read file contain and extract it', (done) => {
    processFile(getSourceFiles('testdata')[0]).subscribe(result => {
      console.log('done');
      done();
    });
  })
});
