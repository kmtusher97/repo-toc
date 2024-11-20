const { getTableOfContents } = require("../lib");

describe("getFilesByExtension", () => {
  test("should return files with specified extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md"];

    const result = getTableOfContents({ dirPath, extensions });
    expect(result).toEqual(
      `* [TestFile3](./TestFile3.md)\n* **test-files**\n  * [Test File 1 Title](./test-files/TestFile1.md)\n`
    );
  });

  test("should return all files no extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [];

    const result = getTableOfContents({ dirPath, extensions });

    expect(result).toEqual(
      `* [TestFile3](./TestFile3.md)\n* **test-files**\n  * [Test File 1 Title](./test-files/TestFile1.md)\n  * [TextFile](./test-files/TextFile.txt)\n`
    );
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
