const fs = require("fs");
const path = require("path");

function getDefaultFileTitle(fileName) {
  const ext = path.extname(fileName);
  return fileName.split(ext)[0];
}

function getMarkdownTitle({ filePath, fileName }) {
  const content = fs.readFileSync(filePath, "utf8");

  const titleMatch = content.match(/^#\s+(.*)/m);

  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return getDefaultFileTitle(fileName);
}

function getFileTitle({ filePath, fileName }) {
  if ([".MD", ".md"].includes(path.extname(filePath))) {
    return getMarkdownTitle({ filePath, fileName });
  }
  return getDefaultFileTitle(fileName);
}

function getFileNames({ dirPath = process.cwd(), extensions = [] }) {
  try {
    // Validate extensions
    if (
      !Array.isArray(extensions) ||
      extensions.some((ext) => typeof ext !== "string")
    ) {
      throw new Error("Extensions must be an array of strings.");
    }

    let fileList = [];

    function readDirectory({ directory, currentDir = "." }) {
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          readDirectory({
            directory: fullPath,
            currentDir: currentDir + "/" + file,
          });
        } else if (
          extensions.length === 0 ||
          extensions.includes(path.extname(file))
        ) {
          fileList.push(currentDir + "/" + file);
        }
      }
    }

    readDirectory({ directory: dirPath });
    return fileList;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getFileNames,
  getFileTitle,
};
