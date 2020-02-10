import { getSourceFiles } from './dirwalk.helper';
import { openFile, dirName, fileName } from './file.helper';

describe('FileHelpper', () => {

  it('should open a file in UTF8', () => {
    const file = getSourceFiles('./testdata')[0];
    const content = openFile(file);
    expect(content).toBeTruthy();
  });


  it('should return file directory', () => {
    // const file = getSourceFiles('./testdata')[0];
    const filePath = '/User/app.json'
    const dir = dirName(filePath);
    console.log('dir', dir);
    expect(dir).toBe('/User');
  });

  it('should return file name', () => {
    // const file = getSourceFiles('./testdata')[0];
    const filePath = '/User/app.json'
    const name = fileName(filePath);
    expect(name).toBe('app.json');
  });
});
