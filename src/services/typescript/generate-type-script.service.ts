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

const replaceCurrentClass = (source: string, currentClass: t.ClassDeclaration): t.File => {
  const file: t.File = parseSourceTypeModule(source);

  traverse(file, {
    ClassDeclaration: function(xPath) {
      xPath.replaceWith(currentClass);
    }
  });
  return file;
}

const parseToTypescript = (source: string): t.File => {
  const availableVariables = extractDeclaredIds(source);
  const classDeclaration = createTsClass(extractAllClassMetaInfos(source));
  const newClass = fixMissingThisKeys(classDeclaration, availableVariables);

  const newSource: t.File = replaceCurrentClass(source, newClass);
  return newSource;
};

const parseToTypescriptFile = (filePath: FilePath): [string, t.File] => {
  const parsed = parseToTypescript(openFile(filePath));
  return [filePath, parsed];
};
const parseToTypescriptFiles = (filePaths: FilePath[]) => filePaths.map(filePath => {
  console.log(`started parsing ${filePath}`);
  const result = parseToTypescriptFile(filePath);
  return result;
});
const parseToTypescriptFolder = (folderPath: FolderPath, rename: boolean, deleteSource: boolean) => {
  const files = getSourceFiles(folderPath);
  const parsedFiles = parseToTypescriptFiles(files);
  parsedFiles.forEach(file => {
    let path = file[0];
    if (rename) {
      path = path.replace('.js', '.ts');
    }
    writeFileSync(path, geneate(file[1]).code)
    console.log(`writting file to disk : ${path}`);
    if (rename && deleteSource) {
      console.log(`deleted file ${file[0]}`)
      deleteFile(file[0]);
    }
  })
}

export { parseToTypescript, parseToTypescriptFolder };
