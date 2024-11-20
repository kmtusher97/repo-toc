const fs = require("fs");
const { generateTableOfContent } = require("..");

describe("generateTableOfContents", () => {
  test("should generate TOC on marker less markdown file", () => {
    const dirPath = __dirname + "/mocks";
    const fileName = "markdownWithoutMarker.md";
    const filePath = __dirname + "/" + fileName;

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

  test("should generate TOC on marker less markdown file", () => {
    const dirPath = __dirname + "/mocks";
    const fileName = "markdownWithMarker.md";
    const filePath = __dirname + "/" + fileName;

    fs.writeFileSync(
      filePath,
      "## Table of contents\n\n\n<!---TOC-START--->\n<!---TOC-END--->\n\n"
    );
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
