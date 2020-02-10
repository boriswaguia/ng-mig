import * as fs from 'fs';
import * as path from 'path';

const format = "UTF-8";

const openFile = (path: string): string => fs.readFileSync(path, format);

const dirName = (filePath: string): string => path.dirname(filePath);

const fileName = (filePath: string): string => path.basename(filePath);

export {openFile, dirName, fileName};
