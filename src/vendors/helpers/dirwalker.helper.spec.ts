import { getSourceFiles } from "./dirwalk.helper";

describe("DirWalkerHelper", () => {
  it("should walker project dir and open files", () => {
    const projectDir = '/Users/bwa/dev/opensource/bwa/akSkeleton';
    expect(getSourceFiles(projectDir)).toHaveLength(8);
  });
});
