const { getFileNames } = require("..");

describe("getFilesByExtension", () => {
  test("should return files with specified extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md"];

    const result = getFileNames({ dirPath, extensions });
    expect(result).toEqual(["./TestFile3.md", "./test-files/TestFile1.md"]);
  });

  test("should return all files no extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [];

    const result = getFileNames({ dirPath, extensions });

    expect(result).toEqual([
      "./TestFile3.md",
      "./test-files/TestFile1.md",
      "./test-files/TextFile.txt",
    ]);
  });

  test("should throw error for non-existent directory", () => {
    const invalidPath = "/invalid/path";
    const extensions = [".txt"];

    expect(() =>
      getFileNames({ dirPath: invalidPath, extensions })
    ).toThrowError(/no such file or directory/);
  });

  test("should throw error for invalid extensions", () => {
    const invalidPath = "/mocks";
    const extensions = [5];

    expect(() =>
      getFileNames({ dirPath: invalidPath, extensions })
    ).toThrowError(/Extensions must be an array of strings/);
  });

  test("should include files with multiple matching extensions", () => {
    const dirPath = __dirname + "/mocks";
    const extensions = [".md", ".txt"];

    const result = getFileNames({ dirPath, extensions });
    expect(result).toContain("./test-files/TextFile.txt");
    expect(result).toContain("./TestFile3.md");
  });
});
