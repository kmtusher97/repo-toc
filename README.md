# repo-toc

[![npm version](https://badge.fury.io/js/repo-toc.svg)](https://badge.fury.io/js/repo-toc)  
Easily generate a markdown Table of Contents (TOC) for your GitHub repository.

## Installation

Install the package using npm:

```bash
npm install -g repo-toc
```

## Usage

`repo-toc` provides a simple way to generate a markdown Table of Contents for all files in your GitHub repository.

### Example

#### Input:

Your directory structure:

```
.
├── TestFile3.md
├── test-files/
│   ├── TestFile1.md
│   └── TextFile.txt
```

#### Output:
The generated Table of Contents:

```markdown
    <!---TOC-START--->
    * [TestFile3](./TestFile3.md)
    * **test-files**
      * [Test File 1 Title](./test-files/TestFile1.md)

    <!---TOC-END--->
```

### CLI
```bash
repo-toc [options]

Options:
      --version  Show version number                                   [boolean]
  -d, --dir      Directory path to generate TOC for
                [string] [default: process.cwd()]
  -e, --ext      File extensions to include (comma-separated)
                                                       [string] [default: ".md"]
  -o, --output   File path to save the TOC     [string] [default: "./README.md"]
  -x, --exclude  Directories to exclude (comma-separated)              [string]
  -h, --help     Show help                                             [boolean]
```

```
repo-toc
```

### Usage Examples

Generate TOC excluding specific directories:
```bash
repo-toc --exclude node_modules,dist,build
```

Generate TOC for only JavaScript files, excluding test directories:
```bash
repo-toc --ext .js,.ts --exclude tests,__tests__,spec
```

### Use with Github actions
It will auto generate the TOC after you commit things on Github. You use this github action
```yml
name: Generate TOC

on:
  push:
    branches:
      - main

jobs:
  toc:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install markdown-toc
      run: npm install -g repo-toc

    - name: Generate TOC
      run: repo-toc -i README.md

    - name: Commit and Push Changes
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "github-actions[bot]@users.noreply.github.com"
        git add README.md
        git commit -m "Update TOC"
        git push
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Code Example

To generate the TOC:

```javascript
const dirPath = __dirname + "/mocks";
const filePath = __dirname + "/" + "README.md";

fs.writeFileSync(filePath, "## Table of contents");
generateTableOfContent({ dirPath, filePath });

// Generate TOC excluding specific directories
generateTableOfContent({
  dirPath: __dirname,
  filePath: "./README.md",
  excludedDirs: ["node_modules", "dist", "build"]
});

// Call the function to generate the TOC
generateTableOfContent();
// It will update the README.md file with the Table of Contents
```

### API

#### `generateTableOfContent(options)`

Generates a Table of Contents for the specified directory.

##### Parameters:
- **`options`** (object): Configuration options for generating the TOC.  
  - **`dirPath`** (string): The directory path to scan for files.  
    - Default: `process.cwd()` (the current working directory).  
  - **`extensions`** (array of strings): An array of file extensions to include in the TOC.  
    - Default: `[".md"]`.  
  - **`filePath`** (string): The path where the generated TOC will be written.  
    - Default: `__dirname + "/README.md"`.
  - **`excludedDirs`** (array of strings): An array of directory names to exclude from the TOC.  
    - Default: `[]`. Note: Directories starting with `.` are automatically excluded.

**Returns**:  
`void`

## Contributing

We welcome contributions! If you'd like to report issues, request features, or submit pull requests, please visit our [GitHub repository](https://github.com/kmtusher97/repo-toc).

### Automated Publishing

This package uses automated publishing to NPM:
- **Automatic**: New versions are published automatically when changes are merged to the main branch
- **Version Bumping**: Semantic versioning based on conventional commit messages
- **Release Notes**: GitHub releases are created automatically with each publish

For setup details, see [Release Setup Guide](.github/RELEASE_SETUP.md).

## License

This package is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

Feel free to customize this further based on additional features or specific instructions.
