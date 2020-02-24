import { extractAllClassMetaInfos } from './search/extract-class-meta.service';
import { extractDeclaredIds } from './search/declared-identifiers.service';
import { createTsClass } from './convert/create-ts-class.service';
import { fixMissingThisKeys } from './convert/fix-missing-this-keys.service';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { parseSourceTypeModule } from '../../vendors/helpers/code-parser.helper';
import { FilePath, FolderPath } from '../split/module.type';
import { openFile, writeFileSync, fileName, deleteFile } from '../../vendors/helpers/file.helper';
import { getSourceFiles } from '../../vendors/helpers/dirwalk.helper';
import geneate from '@babel/generator';

export interface ParseOptions {
  rename?: boolean,
  deleteSource?: boolean,
  softMode?: boolean
}
const replaceCurrentClass = (source: string, currentClass: t.ClassDeclaration): t.File => {
  const file: t.File = parseSourceTypeModule(source);

  traverse(file, {
    ClassDeclaration: function(xPath) {
      xPath.replaceWith(currentClass);
    }
  });
  return file;
}

const parseToTypescript = (source: string, softMode = false): t.File => {
  const availableVariables = extractDeclaredIds(source);
  const classDeclaration = createTsClass(extractAllClassMetaInfos(source));
  const newClass = fixMissingThisKeys(classDeclaration, availableVariables, softMode);

  const newSource: t.File = replaceCurrentClass(source, newClass);
  return newSource;
};

const parseToTypescriptFile = (filePath: FilePath, softMode = false): [string, t.File] => {
  const parsed = parseToTypescript(openFile(filePath), softMode);
  return [filePath, parsed];
};
const parseToTypescriptFiles = (filePaths: FilePath[], softMode = false) => filePaths.map(filePath => {
  console.log(`started parsing ${filePath}`);
  const result = parseToTypescriptFile(filePath, softMode);
  return result;
});
const parseToTypescriptFolder = (folderPath: FolderPath, options: ParseOptions) => {
  const files = getSourceFiles(folderPath);
  const parsedFiles = parseToTypescriptFiles(files, options.softMode);
  parsedFiles.forEach(file => {
    let path = file[0];
    if (options.rename) {
      path = path.replace('.js', '.ts');
    }
    writeFileSync(path, geneate(file[1]).code)
    console.log(`writting file to disk : ${path}`);
    if (options.rename && options.deleteSource) {
      console.log(`deleted file ${file[0]}`)
      deleteFile(file[0]);
    }
  })
}

export { parseToTypescript, parseToTypescriptFolder };
