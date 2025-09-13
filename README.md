# repo-toc

[![npm version](https://badge.fury.io/js/repo-toc.svg)](https://badge.fury.io/js/repo-toc)  
Easily generate a markdown Table of Contents (TOC) for your GitHub repository. Automatically respects `.gitignore` files and excludes ignored files and directories from the TOC.

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

**Important**: Files and directories listed in `.gitignore` files are automatically excluded from the TOC generation. This includes:
- Files and directories specified in `.gitignore` at any level in your repository
- Common ignored patterns like `node_modules/`, `dist/`, `build/`, `.git/`, etc.
- You can still use the `--exclude` option to exclude additional directories beyond what's in `.gitignore`
```

```
repo-toc
```

### .gitignore Support

`repo-toc` automatically respects `.gitignore` files throughout your repository:

- **Automatic exclusion**: Files and directories listed in `.gitignore` are automatically excluded from TOC generation
- **Multi-level support**: Respects `.gitignore` files at any directory level in your repository
- **Common patterns**: Automatically excludes common ignored patterns like `node_modules/`, `dist/`, `build/`, `.git/`, etc.
- **Additional exclusions**: You can still use the `--exclude` option to exclude additional directories beyond what's in `.gitignore`

This ensures your TOC only includes files that are actually tracked in your repository, keeping it clean and relevant.

### Usage Examples

Generate TOC excluding specific directories:
```bash
repo-toc --exclude node_modules,dist,build
```

Generate TOC for only JavaScript files, excluding test directories:
```bash
repo-toc --ext .js,.ts --exclude tests,__tests__,spec
```

**Note**: The tool automatically respects `.gitignore` files and excludes any files or directories listed there, in addition to your manual exclusions. This ensures your TOC only includes files that are actually tracked in your repository.

### Use with Pre-commit Hooks

You can integrate `repo-toc` with pre-commit hooks to automatically generate and update the TOC before each commit. This ensures your TOC is always up-to-date.

#### Setup

1. **Install pre-commit** (if not already installed):
```bash
pip install pre-commit
```

2. **Add repo-toc to your package.json**:
```json
{
  "devDependencies": {
    "repo-toc": "^1.2.0"
  },
  "scripts": {
    "generate-toc": "./.github/hooks/generate-toc.sh",
    "install-hooks": "pre-commit install"
  }
}
```

3. **Create a pre-commit hook script** (`.github/hooks/generate-toc.sh`):
```bash
#!/bin/bash
set -e

echo "🔄 Generating Table of Contents..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is not installed. Please install Node.js to generate TOC."
    exit 1
fi

# Install repo-toc if not already installed
if ! npm list -g repo-toc &> /dev/null; then
    echo "📦 Installing repo-toc globally..."
    npm install -g repo-toc
fi

# Generate TOC for README.md
if [ -f "README.md" ]; then
    echo "📝 Updating Table of Contents in README.md..."
    
    # Create a backup
    cp README.md README.md.backup
    
    # Generate TOC with repo-toc
    repo-toc -i README.md
    
    # Check if the file was modified
    if ! cmp -s README.md README.md.backup; then
        echo "✅ Table of Contents updated successfully!"
        # Add the updated file to git staging area
        git add README.md
    else
        echo "ℹ️  Table of Contents is already up to date."
    fi
    
    # Clean up backup
    rm README.md.backup
else
    echo "❌ README.md not found in current directory"
    exit 1
fi

echo "🎉 TOC generation completed!"
```

4. **Configure pre-commit** (`.pre-commit-config.yaml`):
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-markdown
        args: [--fix]

  - repo: local
    hooks:
      - id: generate-toc
        name: Generate Table of Contents
        entry: ./.github/hooks/generate-toc.sh
        language: script
        files: '^README\.md$'
        pass_filenames: false
        stages: [commit]

  - repo: https://github.com/igorshubovych/markdownlint-cli
    rev: v0.37.0
    hooks:
      - id: markdownlint
        args: [--fix]
        files: \.md$
```

5. **Install the pre-commit hooks**:
```bash
npm run install-hooks
# or
pre-commit install
```

#### Benefits

- **Automatic TOC updates**: TOC is generated/updated automatically before each commit
- **Consistent formatting**: Ensures TOC follows the same format across all commits
- **No manual intervention**: Developers don't need to remember to update the TOC
- **Integration with other hooks**: Works seamlessly with markdown linting and other pre-commit hooks

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
// Note: .gitignore files are automatically respected
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
    - Default: `[]`. 
    - **Automatic exclusions**: Directories starting with `.` and files/directories listed in `.gitignore` files are automatically excluded, regardless of this parameter.
    - This parameter allows you to exclude additional directories beyond what's already ignored by `.gitignore`.

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
