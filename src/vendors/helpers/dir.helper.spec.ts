import { getCurrentDir, dirExist } from './directory.helper';


describe('CurrentDirHelper', () => {
  it('should return current dir', () => {
    const result = getCurrentDir();
    expect(result).toBeTruthy();
  });


  it('should return true if directory exist', () => {
    const result = dirExist('/Users/bwa/dev/opensource/bwa/ng-mig');
    expect(result).toBeTruthy();
  });
});
