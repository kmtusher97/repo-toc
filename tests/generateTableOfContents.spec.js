const fs = require("fs");
const path = require("path");
const { generateTableOfContent, getTableOfContents } = require("../lib");
const { cleanupTestArtifacts, assertTocContent } = require("./helpers/testUtils");

describe("generateTableOfContents", () => {
  test("should generate TOC on marker less markdown file", () => {
    const dirPath = __dirname + "/mocks";
    const fileName = "markdownWithoutMarker.md";
    const filePath = __dirname + "/" + fileName;

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

  test("should generate TOC on markdown file with markers", () => {
    const dirPath = __dirname + "/mocks";
    const fileName = "markdownWithMarker.md";
    const filePath = __dirname + "/" + fileName;

    cleanupTestArtifacts(dirPath);

    fs.writeFileSync(
      filePath,
      "## Table of contents\n\n\n<!---TOC-START--->\n<!---TOC-END--->\n\n"
    );
    generateTableOfContent({ dirPath, filePath });

    const fileContent = fs.readFileSync(filePath, "utf8");
    assertTocContent(fileContent);

    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  test("should exclude specified directories from TOC", () => {
    const dirPath = __dirname + "/mocks";
    
    // Create a temporary directory to exclude
    const tempDir = path.join(dirPath, "temp-exclude");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Create a markdown file in the temp directory
    const tempFile = path.join(tempDir, "temp.md");
    fs.writeFileSync(tempFile, "# Temporary File\n\nThis should be excluded.");

    try {
      // Generate TOC without exclusions
      const tocWithoutExclusions = getTableOfContents({ 
        dirPath, 
        extensions: [".md"] 
      });
      
      // Generate TOC with exclusions
      const tocWithExclusions = getTableOfContents({ 
        dirPath, 
        extensions: [".md"],
        excludedDirs: ["temp-exclude"]
      });

      // The version with exclusions should not contain the temp directory
      expect(tocWithoutExclusions).toContain("temp-exclude");
      expect(tocWithExclusions).not.toContain("temp-exclude");
      expect(tocWithExclusions).not.toContain("Temporary File");
      
      // Both should still contain the other test files
      expect(tocWithoutExclusions).toContain("TestFile3");
      expect(tocWithExclusions).toContain("TestFile3");
      
    } finally {
      // Clean up temporary files
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir);
      }
    }
  });

  test("should exclude multiple directories from TOC", () => {
    const dirPath = __dirname + "/mocks";
    
    // Test excluding the existing test-files directory
    const tocWithExclusions = getTableOfContents({ 
      dirPath, 
      extensions: [".md"],
      excludedDirs: ["test-files"]
    });

    // Should not contain the excluded directory
    expect(tocWithExclusions).not.toContain("test-files");
    expect(tocWithExclusions).not.toContain("Test File 1 Title");
    
    // Should still contain files in the root
    expect(tocWithExclusions).toContain("TestFile3");
  });
});
