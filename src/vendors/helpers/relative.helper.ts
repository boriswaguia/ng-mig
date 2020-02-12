const relative = require('relative');

const relativePath = (fileOne: string, fileTwo: string) => {
  let result: string = relative(fileOne, fileTwo);
  if(result && !result.startsWith('./') && !result.startsWith('../')) {
    result = `./${result}`;
  }
  return result;
};

const relativeImportPath = (fileOne: string, fileTwo: string) => {
  const path = relativePath(fileOne, fileTwo);
  const paths = path.split('.');
  paths.pop();
  const extensionRemovedRelativePath = paths.join('.');
  return extensionRemovedRelativePath;
}
export { relativePath, relativeImportPath };
