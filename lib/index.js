const fs = require("fs");
const path = require("path");

const { shouldSkipFolder, getFileTitle } = require("./utils");

function getTableOfContents({ dirPath = process.cwd(), extensions = [] }) {
  try {
    if (
      !Array.isArray(extensions) ||
      extensions.some((ext) => typeof ext !== "string")
    ) {
      throw new Error("Extensions must be an array of strings.");
    }

    let toc = "";

    function readDirectory({ directory, currentDir = ".", level = 0 }) {
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (shouldSkipFolder(file)) {
            continue;
          }
          toc += `${" ".repeat(level * 2)}* **${file}**\n`;
          readDirectory({
            directory: fullPath,
            currentDir: currentDir + "/" + file,
            level: level + 1,
          });
        } else if (
          extensions.length === 0 ||
          extensions.includes(path.extname(file))
        ) {
          const filePath = currentDir + "/" + file;
          toc += `${" ".repeat(level * 2)}* [${getFileTitle(
            fullPath
          )}](${filePath})\n`;
        }
      }
    }

    readDirectory({ directory: dirPath });
    return toc;
  } catch (error) {
    throw error;
  }
}

function updateTOC({ filePath = __dirname + "/README.md", contentToAdd }) {
  try {
    let fileContent = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : "";

    const tocStart = "<!---TOC-START--->";
    const tocEnd = "<!---TOC-END--->";

    const tocStartIndex = fileContent.indexOf(tocStart);
    const tocEndIndex = fileContent.indexOf(tocEnd);

    if (tocStartIndex !== -1 && tocEndIndex !== -1) {
      fileContent =
        fileContent.substring(0, tocStartIndex + tocStart.length) +
        `\n${contentToAdd}\n` +
        fileContent.substring(tocEndIndex);
    } else {
      const tocSection = `${tocStart}\n${contentToAdd}\n${tocEnd}`;
      fileContent = `${fileContent}\n\n${tocSection}`.trim();
    }

    fs.writeFileSync(filePath, fileContent, "utf8");
  } catch (err) {
    console.error("Error updating the TOC:", err.message);
  }
}

function generateTableOfContent({
  dirPath = process.cwd(),
  extensions = [".md"],
  filePath = __dirname + "/README.md",
}) {
  updateTOC({
    filePath,
    contentToAdd: getTableOfContents({ dirPath, extensions }),
  });
}

module.exports = {
  getFileTitle,
  getTableOfContents,
  generateTableOfContent,
};
