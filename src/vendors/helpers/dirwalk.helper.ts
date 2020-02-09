import { create } from "filehound";

const getSourceFiles = (rootDir: string): string[] => {
  const srcDir = `${rootDir}/src`;
  return create()
    .paths(srcDir)
    .ext('js')
    .findSync();
};

export { getSourceFiles };
