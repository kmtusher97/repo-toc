const { getFileNames } = require("..");

describe("getFilesByExtension", () => {
  test("should return files with specified extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md"];

    const result = getFileNames({ dirPath, extensions });
    expect(result).toEqual(["./TestFile3.md", "./test-files/TestFile1.md"]);
  });
});
