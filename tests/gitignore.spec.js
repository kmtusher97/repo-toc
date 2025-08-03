const fs = require("fs");
const path = require("path");
const {
  shouldSkipFolder,
  shouldSkipFile,
  isGitignored,
} = require("../lib/utils");
const { getTableOfContents } = require("../lib");

describe("Gitignore functionality", () => {
  const testDir = path.join(__dirname, "mocks", "gitignore-test");

  beforeAll(() => {
    // Create test directory structure
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create test .gitignore file
    const gitignoreContent = `
# Comments should be ignored
node_modules/
*.log
build
dist/
temp*.md
.env
*.test.js
`;
    fs.writeFileSync(path.join(testDir, ".gitignore"), gitignoreContent);

    // Create test files and directories
    fs.mkdirSync(path.join(testDir, "node_modules"), { recursive: true });
    fs.mkdirSync(path.join(testDir, "dist"), { recursive: true });
    fs.mkdirSync(path.join(testDir, "src"), { recursive: true });

    fs.writeFileSync(path.join(testDir, "app.log"), "log content");
    fs.writeFileSync(path.join(testDir, "build"), "build file");
    fs.writeFileSync(path.join(testDir, "temp-file.md"), "temp content");
    fs.writeFileSync(path.join(testDir, "README.md"), "# Test README");
    fs.writeFileSync(path.join(testDir, ".env"), "SECRET=value");
    fs.writeFileSync(path.join(testDir, "app.test.js"), "test content");
    fs.writeFileSync(path.join(testDir, "app.js"), "app content");
  });

  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test("should detect gitignored directories", () => {
    expect(shouldSkipFolder("node_modules", [], testDir, testDir)).toBe(true);
    expect(shouldSkipFolder("dist", [], testDir, testDir)).toBe(true);
    expect(shouldSkipFolder("src", [], testDir, testDir)).toBe(false);
  });

  test("should detect gitignored files", () => {
    expect(shouldSkipFile("app.log", testDir, testDir)).toBe(true);
    expect(shouldSkipFile("build", testDir, testDir)).toBe(true);
    expect(shouldSkipFile("temp-file.md", testDir, testDir)).toBe(true);
    expect(shouldSkipFile(".env", testDir, testDir)).toBe(true);
    expect(shouldSkipFile("app.test.js", testDir, testDir)).toBe(true);
    expect(shouldSkipFile("README.md", testDir, testDir)).toBe(false);
    expect(shouldSkipFile("app.js", testDir, testDir)).toBe(false);
  });

  test("should work with isGitignored function directly", () => {
    expect(isGitignored(path.join(testDir, "node_modules"), testDir)).toBe(
      true
    );
    expect(isGitignored(path.join(testDir, "app.log"), testDir)).toBe(true);
    expect(isGitignored(path.join(testDir, "README.md"), testDir)).toBe(false);
    expect(isGitignored(path.join(testDir, "app.js"), testDir)).toBe(false);
  });

  test("should exclude gitignored files from TOC generation", () => {
    const toc = getTableOfContents({
      dirPath: testDir,
      extensions: [".md", ".js"],
    });

    // Should include non-gitignored files
    expect(toc).toContain("README.md");
    expect(toc).toContain("app.js");
    expect(toc).toContain("**src**");

    // Should exclude gitignored files and directories
    expect(toc).not.toContain("node_modules");
    expect(toc).not.toContain("dist");
    expect(toc).not.toContain("temp-file.md");
    expect(toc).not.toContain("app.test.js");
  });

  test("should handle missing .gitignore file gracefully", () => {
    const testDirNoGitignore = path.join(__dirname, "mocks", "no-gitignore");

    if (!fs.existsSync(testDirNoGitignore)) {
      fs.mkdirSync(testDirNoGitignore, { recursive: true });
    }

    fs.writeFileSync(path.join(testDirNoGitignore, "test.md"), "# Test");

    try {
      expect(
        shouldSkipFile("test.md", testDirNoGitignore, testDirNoGitignore)
      ).toBe(false);
      expect(
        shouldSkipFolder("testdir", [], testDirNoGitignore, testDirNoGitignore)
      ).toBe(false);

      const toc = getTableOfContents({
        dirPath: testDirNoGitignore,
        extensions: [".md"],
      });
      expect(toc).toContain("test.md");
    } finally {
      // Clean up
      if (fs.existsSync(testDirNoGitignore)) {
        fs.rmSync(testDirNoGitignore, { recursive: true, force: true });
      }
    }
  });

  test("should combine gitignore with manual exclusions", () => {
    const toc = getTableOfContents({
      dirPath: testDir,
      extensions: [".md", ".js"],
      excludedDirs: ["src"], // Manually exclude src directory
    });

    // Should exclude both gitignored and manually excluded items
    expect(toc).not.toContain("node_modules"); // gitignored
    expect(toc).not.toContain("src"); // manually excluded
    expect(toc).not.toContain("temp-file.md"); // gitignored

    // Should include non-excluded files
    expect(toc).toContain("README.md");
    expect(toc).toContain("app.js");
  });
});
