const { getTableOfContents } = require("../lib");
const { cleanupTestArtifacts, assertTocContent } = require("./helpers/testUtils");

describe("getFilesByExtension", () => {
  test("should return files with specified extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md"];

    cleanupTestArtifacts(dirPath);

    const result = getTableOfContents({ dirPath, extensions });
    assertTocContent(result);
  });

  test("should return all files no extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [];

    cleanupTestArtifacts(dirPath);

    const result = getTableOfContents({ dirPath, extensions });
    assertTocContent(result, { shouldContainTextFile: true });
  });

  test("should throw error for non-existent directory", () => {
    const invalidPath = "/invalid/path";
    const extensions = [".txt"];

    expect(() =>
      getTableOfContents({ dirPath: invalidPath, extensions })
    ).toThrowError(/no such file or directory/);
  });

  test("should throw error for invalid extensions", () => {
    const invalidPath = "/mocks";
    const extensions = [5];

    expect(() =>
      getTableOfContents({ dirPath: invalidPath, extensions })
    ).toThrowError(/Extensions must be an array of strings/);
  });

  test("should include files with multiple matching extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md", ".txt"];

    const result = getTableOfContents({ dirPath, extensions });
    expect(result).toContain("./test-files/TextFile.txt");
    expect(result).toContain("./TestFile3.md");
  });
});
