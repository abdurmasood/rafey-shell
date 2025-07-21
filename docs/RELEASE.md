# Release Process Documentation

## 🚀 Single Workflow CI/CD

RafeyShell uses **one GitHub Actions workflow** (`ci-cd.yml`) that handles everything: quality checks, releases, and publishing to npm + GitHub Packages.

## 📋 Setup Requirements

### Required GitHub Secrets
Add this secret in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `NPM_TOKEN` | npm registry access token | [npmjs.com](https://npmjs.com) → Profile → Access Tokens → Generate New Token (Automation) |

### Repository Permissions
- **Actions**: Allow GitHub Actions to create and approve pull requests
- **Packages**: Allow Actions to publish packages

## 🔄 How It Works

### Single Workflow (`ci-cd.yml`) handles:

#### **Quality Gates Job** 
*Runs on every push/PR*
- ✅ TypeScript compilation check
- ✅ Project build (`pnpm build`)
- ✅ Security audit of dependencies
- ✅ Caches build artifacts

#### **Create Release Job**
*Only runs when manually triggered*
- ✅ Calculates new version (patch/minor/major)
- ✅ Generates changelog from git commits
- ✅ Updates package.json version
- ✅ Creates git tag and pushes it
- ✅ Creates GitHub release

#### **Publish Job**
*Only runs when git tag is created*
- ✅ Publishes to npm with provenance
- ✅ Publishes to GitHub Packages (@abdurmasood/rafey-shell)
- ✅ Uses cached build artifacts

## 🎯 Release Process

### Method 1: GitHub Actions UI (Recommended)
1. **Go to Actions tab** in your repository
2. **Click "CI/CD Pipeline"** workflow
3. **Click "Run workflow"** button
4. **Select version type**: patch (1.0.1), minor (1.1.0), or major (2.0.0)
5. **Optionally check "prerelease"** for beta versions
6. **Click "Run workflow"**

**What happens automatically:**
```
Manual Trigger → Quality Checks → Version Bump → Git Tag → Publishing → Done! 
```

### Method 2: Command Line
```bash
# Create and push a tag manually
git tag v1.2.3
git push origin v1.2.3

# This triggers automatic publishing
```

## 📦 Publishing Destinations

Your package gets published to both registries:

### npm Registry
- **Package**: `rafey-shell`
- **Install**: `npm install -g rafey-shell`
- **Run**: `rafey-shell` or `rs`

### GitHub Packages
- **Package**: `@abdurmasood/rafey-shell`
- **Install**: `npm install -g @abdurmasood/rafey-shell`
- **Run**: `rafey-shell` or `rs`

## 🔧 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/awesome-feature

# 2. Make changes and commit
git add .
git commit -m "Add awesome feature"

# 3. Push and create PR
git push origin feature/awesome-feature
# Create PR to main branch in GitHub

# 4. After PR is merged, create release
# Go to Actions → CI/CD Pipeline → Run workflow
```

## 📊 Version Strategy

- **Patch** (1.0.1): Bug fixes, small improvements
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes
- **Prerelease** (1.1.0-beta.1): Testing versions

## 🛠️ Troubleshooting

### Publishing Fails
- **Check NPM_TOKEN**: Ensure it exists and has publishing permissions
- **Version conflict**: Package version already exists on npm
- **Network issues**: Retry the workflow

### Quality Checks Fail
- **TypeScript errors**: Fix type issues in your code
- **Build errors**: Ensure `pnpm build` works locally
- **Security issues**: Update vulnerable dependencies

### Release Creation Fails
- **Permissions**: Ensure Actions can write to repository
- **Clean working directory**: Commit all changes before release
- **Unique tags**: Don't reuse existing version numbers

## 📈 Monitoring

Track your releases:
- **npm downloads**: https://npmjs.com/package/rafey-shell
- **GitHub releases**: Repository → Releases
- **Package usage**: GitHub → Insights → Community

## 🔒 Security Features

- **Automated security audits** on every PR
- **npm provenance statements** prove package authenticity  
- **Scoped GitHub packages** prevent name squatting
- **Token rotation**: Regularly update your NPM_TOKEN

## ⚡ Quick Commands

```bash
# Install from npm
npm install -g rafey-shell

# Install from GitHub
npm install -g @abdurmasood/rafey-shell

# Run the CLI
rafey-shell
# or
rs

# Check version
rafey-shell --version
```

That's it! **One workflow, three jobs, zero complexity.**