const { getFileTitle } = require("../lib");

describe("getFileTitle", () => {
  test("should return markdown file title", () => {
    const fileName = "TestFile1.md";
    const filePath = __dirname + `/mocks/test-files/${fileName}`;

    const title = getFileTitle(filePath);
    expect(title).toEqual("Test File 1 Title");
  });

  test("should return file title for markdown files without title", () => {
    const fileName = "TestFile3.md";
    const filePath = __dirname + `/mocks//${fileName}`;

    const title = getFileTitle(filePath);
    expect(title).toEqual("TestFile3");
  });

  test("should return file title for non markdown files", () => {
    const fileName = "TextFile.txt";
    const filePath = __dirname + `/mocks/test-files/${fileName}`;

    const title = getFileTitle(filePath);
    expect(title).toEqual("TextFile");
  });
});
