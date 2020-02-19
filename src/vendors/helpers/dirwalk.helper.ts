import { create } from "filehound";

const getSourceFiles = (rootDir: string, ext = 'js'): string[] => {
  const srcDir = `${rootDir}/src`;
  const result = create()
    .paths(srcDir)
    .ext(ext)
    .findSync();
    return result;
};

export { getSourceFiles };
