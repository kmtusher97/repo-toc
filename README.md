# repo-toc

[![npm version](https://badge.fury.io/js/repo-toc.svg)](https://badge.fury.io/js/repo-toc)  
Easily generate a markdown Table of Contents (TOC) for your GitHub repository.

## Installation

Install the package using npm:

```bash
npm install repo-toc
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

### Code Example

To generate the TOC:

```javascript
const dirPath = __dirname + "/mocks";
const filePath = __dirname + "/" + "README.md";

fs.writeFileSync(filePath, "## Table of contents");
generateTableOfContent({ dirPath, filePath });

// Call the function to generate the TOC
const toc = generateTableOfContent();
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

**Returns**:  
`void`

## Contributing

We welcome contributions! If you'd like to report issues, request features, or submit pull requests, please visit our [GitHub repository](https://github.com/kmtusher97/repo-toc).

## License

This package is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

Feel free to customize this further based on additional features or specific instructions.
