# Release and NPM Publishing Setup

This repository uses GitHub Actions to automatically publish to NPM when changes are merged into the main branch.

## Prerequisites

### 1. NPM Token Setup

1. **Create NPM Access Token:**
   - Go to [npmjs.com](https://www.npmjs.com) and log in
   - Navigate to your account settings
   - Go to "Access Tokens"
   - Click "Generate New Token"
   - Choose "Automation" type for CI/CD use
   - Copy the generated token

2. **Add NPM Token to GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_ACCESS_TOKEN`
   - Value: Your NPM access token
   - Click "Add secret"

### 2. Repository Permissions

Ensure the repository has the following permissions:
- **Actions**: Read and write permissions (for workflow execution)
- **Contents**: Write permissions (for creating releases and pushing tags)
- **Metadata**: Read permissions

You can check/set these in: Repository Settings → Actions → General → Workflow permissions

## Release Workflow Options

We provide two approaches for NPM publishing:

### Option 1: Automatic Publishing (Current - `release.yml`)
- **Trigger**: Runs on every push to the `main` branch
- **Conditional**: Only runs if the commit message doesn't contain "chore: bump version" (prevents infinite loops)
- **Pros**: Fully automated, no manual steps required
- **Cons**: Every merge to main creates a new version

### Option 2: Manual Release Publishing (GitHub's Recommended - `release-on-tag.yml.example`)
- **Trigger**: Runs when you manually create a GitHub release
- **Process**: Create release in GitHub → automatically publishes to NPM
- **Pros**: Full control over when versions are published
- **Cons**: Requires manual release creation

To switch to Option 2:
1. Rename `.github/workflows/release-on-tag.yml.example` to `.github/workflows/release-on-tag.yml`
2. Disable or delete `.github/workflows/release.yml`

## How the Current Workflow Works (Option 1)

### Version Bumping Strategy
The workflow automatically determines the version bump type based on commit messages:

- **Minor version bump** (1.0.4 → 1.1.0):
  - Commits starting with `feat:` or `feature:`
  - Commits containing "BREAKING CHANGE"

- **Patch version bump** (1.0.4 → 1.0.5):
  - Commits starting with `fix:` or `bug:`
  - Commits starting with `perf:`, `refactor:`, `style:`, `docs:`, `test:`, `chore:`
  - Any other commit type (default)

### Workflow Steps (Option 1 - Automatic)
1. **Checkout code** and set up Node.js environment
2. **Install dependencies** with `npm ci` and run tests
3. **Determine version bump type** from commit messages
4. **Bump version** in package.json and package-lock.json
5. **Commit and tag** the version bump
6. **Push changes** back to the repository
7. **Publish to NPM** with provenance for enhanced security
8. **Create GitHub Release** with auto-generated release notes

### Workflow Steps (Option 2 - Manual Release)
1. **Manual**: Create a GitHub release with desired version tag
2. **Automatic**: Workflow triggers on release creation
3. **Checkout code** and set up Node.js environment
4. **Install dependencies** with `npm ci` and run tests
5. **Publish to NPM** with provenance for enhanced security

## Testing the Workflow

### Local Testing
Before merging to main, you can test the workflow logic locally:

```bash
# Test version bumping
npm version patch --no-git-tag-version
npm version minor --no-git-tag-version
npm version major --no-git-tag-version

# Reset version (if testing)
git checkout -- package.json package-lock.json
```

### Dry Run Publishing
To test NPM publishing without actually publishing:

```bash
npm publish --dry-run
```

## Commit Message Format

For best results, use conventional commit messages:

```bash
# For patch releases (bug fixes)
git commit -m "fix: resolve directory exclusion edge case"

# For minor releases (new features)
git commit -m "feat: add directory exclusion capability"

# For major releases (breaking changes)
git commit -m "feat: redesign API structure

BREAKING CHANGE: API function signatures have changed"
```

## Manual Release (if needed)

If you need to publish manually:

```bash
# Bump version
npm version patch|minor|major

# Publish to NPM
npm publish

# Push tags
git push origin main --tags
```

## Troubleshooting

### Common Issues

1. **NPM Token Invalid**: Regenerate token and update GitHub secret (`NPM_ACCESS_TOKEN`)
2. **Permission Denied**: Check repository workflow permissions
3. **Version Conflict**: Ensure version doesn't already exist on NPM
4. **Tests Failing**: Workflow will not publish if tests fail

### Logs
Check the Actions tab in your GitHub repository for detailed workflow logs.