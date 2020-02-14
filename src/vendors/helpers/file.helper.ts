import * as fse from 'fs-extra';
import * as path from 'path';

const format = "UTF-8";

const openFile = (path: string): string => fse.readFileSync(path, format);

const dirName = (filePath: string): string => path.dirname(filePath);

const fileName = (filePath: string): string => path.basename(filePath);

const writeFileSync = (filePath: string, content: string) => fse.writeFileSync(filePath, content);

const renameSync = (filePath: string, newFilePath: string) => fse.renameSync(filePath, newFilePath);

const existsSync = (path: string) => fse.existsSync(path);

const copySync = (src: string, dest: string) => fse.copySync(src, dest);

const mkdirSync = (dirPath: string) => fse.mkdirSync(dirPath, { recursive: true});

const pathExistsSync = (path: string) => fse.pathExistsSync(path);

export {openFile, dirName, fileName, writeFileSync, renameSync, existsSync, copySync, mkdirSync, pathExistsSync};
