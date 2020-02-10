import { create } from "filehound";

const getSourceFiles = (rootDir: string): string[] => {
  const srcDir = `${rootDir}/src`;
  const result = create()
    .paths(srcDir)
    .ext('js')
    .findSync();
    console.log('result', result);
    return result;
};

export { getSourceFiles };
