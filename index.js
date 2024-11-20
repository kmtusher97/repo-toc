const fs = require("fs");
const path = require("path");

/**
 * Get all file names in a directory with specific extensions.
 * @param {string} [dirPath=process.cwd()] - Directory path (default: current working directory).
 * @param {string[]} extensions - List of file extensions to filter (e.g., ['.md', '.txt']).
 * @returns {string[]} - List of file names with the specified extensions.
 */
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
    console.error("Error reading directory:", error.message);
    throw error;
  }
}

module.exports = {
  getFileNames,
};
