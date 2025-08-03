const fs = require("fs");
const path = require("path");

// Cache for gitignore patterns to avoid reading files multiple times
const gitignoreCache = new Map();

function readGitignorePatterns(dirPath) {
  if (gitignoreCache.has(dirPath)) {
    return gitignoreCache.get(dirPath);
  }

  const gitignorePath = path.join(dirPath, '.gitignore');
  let patterns = [];

  if (fs.existsSync(gitignorePath)) {
    try {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      patterns = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
        .map(pattern => {
          // Convert basic gitignore patterns to regex-like matching
          // Handle trailing slashes (directory-only patterns)
          if (pattern.endsWith('/')) {
            return { pattern: pattern.slice(0, -1), dirOnly: true };
          }
          return { pattern, dirOnly: false };
        });
    } catch (error) {
      console.warn(`Warning: Could not read .gitignore file at ${gitignorePath}`);
    }
  }

  gitignoreCache.set(dirPath, patterns);
  return patterns;
}

function getAllGitignorePatterns(targetPath, currentPath = targetPath) {
  let allPatterns = [];
  
  // Get patterns from current directory
  const currentPatterns = readGitignorePatterns(currentPath);
  allPatterns = allPatterns.concat(currentPatterns);
  
  // Check parent directories up to the target path
  const parentDir = path.dirname(currentPath);
  if (parentDir !== currentPath && parentDir.startsWith(targetPath)) {
    allPatterns = allPatterns.concat(getAllGitignorePatterns(targetPath, parentDir));
  }
  
  return allPatterns;
}

function matchesGitignorePattern(filePath, relativePath, patterns) {
  for (const { pattern, dirOnly } of patterns) {
    // Skip directory-only patterns for files
    if (dirOnly && !fs.existsSync(filePath)) continue;
    if (dirOnly && fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) continue;

    // Simple pattern matching
    if (pattern.includes('*')) {
      // Convert glob pattern to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      
      const regex = new RegExp('^' + regexPattern + '$');
      if (regex.test(relativePath) || regex.test(path.basename(relativePath))) {
        return true;
      }
    } else {
      // Exact match or substring match
      if (relativePath === pattern || 
          relativePath.endsWith('/' + pattern) || 
          path.basename(relativePath) === pattern) {
        return true;
      }
    }
  }
  
  return false;
}

function isGitignored(filePath, rootPath) {
  const relativePath = path.relative(rootPath, filePath);
  const dirPath = path.dirname(filePath);
  
  // Get all gitignore patterns from current directory up to root
  const patterns = getAllGitignorePatterns(rootPath, dirPath);
  
  return matchesGitignorePattern(filePath, relativePath, patterns);
}

function shouldSkipFolder(folderName, excludedDirs = [], folderPath = '', rootPath = '') {
  // Skip folders starting with dot (hidden folders)
  if (folderName.startsWith(".")) {
    return true;
  }
  
  // Skip folders in the excluded directories list
  if (excludedDirs.includes(folderName)) {
    return true;
  }
  
  // Skip folders matching .gitignore patterns
  if (rootPath && folderPath) {
    const fullFolderPath = path.join(folderPath, folderName);
    if (isGitignored(fullFolderPath, rootPath)) {
      return true;
    }
  }
  
  return false;
}

function shouldSkipFile(fileName, filePath = '', rootPath = '') {
  // Skip files matching .gitignore patterns
  if (rootPath && filePath) {
    const fullFilePath = path.join(filePath, fileName);
    if (isGitignored(fullFilePath, rootPath)) {
      return true;
    }
  }
  
  return false;
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
  shouldSkipFile,
  isGitignored,
};
