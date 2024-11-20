const fs = require("fs");
const path = require("path");

function getDefaultFileTitle(filePath) {
  const fileSegments = filePath.split("/");
  const fileName = fileSegments[fileSegments.length - 1];
  const ext = path.extname(fileName);
  return fileName.split(ext)[0];
}

function getMarkdownTitle(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const titleMatch = content.match(/^#\s+(.*)/m);

  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return getDefaultFileTitle(filePath);
}

function getFileTitle(filePath) {
  if ([".MD", ".md"].includes(path.extname(filePath))) {
    return getMarkdownTitle(filePath);
  }
  return getDefaultFileTitle(filePath);
}


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

module.exports = {
  getFileTitle,
  getTableOfContents,
};
