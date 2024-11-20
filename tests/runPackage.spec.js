const fs = require("fs");
const { generateTableOfContent } = require("repo-toc");

describe("test repo-toc package", () => {
  test("should generate TOC on marker less markdown file", () => {
    const dirPath = __dirname + "/mocks";

    const filePath = __dirname + "/" + "temp.md";

    fs.writeFileSync(filePath, "## Table of contents");
    generateTableOfContent({ dirPath, filePath });

    const fileContent = fs.readFileSync(filePath, "utf8");

    expect(fileContent).toContain(
      `* [TestFile3](./TestFile3.md)\n* **test-files**\n  * [Test File 1 Title](./test-files/TestFile1.md)\n`
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
