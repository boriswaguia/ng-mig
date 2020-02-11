import { getSourceFiles } from "./dirwalk.helper";

describe("DirWalkerHelper", () => {
  it("should return files list of a folder", () => {
    const projectDir = './testdata'; // starting from the project root_path
    expect(getSourceFiles(projectDir).length).toBeGreaterThanOrEqual(1);
  });
});
