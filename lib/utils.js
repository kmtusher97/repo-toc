const fs = require("fs");
const path = require("path");

function shouldSkipFolder(folderName) {
  return folderName.startsWith(".");
}

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

module.exports = {
  getFileTitle,
  shouldSkipFolder,
};
