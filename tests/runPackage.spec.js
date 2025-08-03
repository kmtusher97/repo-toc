const fs = require("fs");
const { generateTableOfContent } = require("repo-toc");
const { cleanupTestArtifacts, assertTocContent } = require("./helpers/testUtils");

describe("test repo-toc package", () => {
  test("should generate TOC on marker less markdown file", () => {
    const dirPath = __dirname + "/mocks";
    const filePath = __dirname + "/" + "temp.md";

    cleanupTestArtifacts(dirPath);

    fs.writeFileSync(filePath, "## Table of contents");
    generateTableOfContent({ dirPath, filePath });

    const fileContent = fs.readFileSync(filePath, "utf8");
    assertTocContent(fileContent);

    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
