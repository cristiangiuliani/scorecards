# Versioning System

This project uses an automatic versioning system that follows [Semantic Versioning](https://semver.org/).

## How It Works

### Automatic Versioning (Patch)

**Every commit to the `main` branch automatically increments the patch version.**

Example:
- Commit to `main` → `1.0.0` → `1.0.1`
- Another commit to `main` → `1.0.1` → `1.0.2`

The GitHub Actions workflow:
1. Automatically increments the patch version in `package.json`
2. Creates a commit with the message "chore: bump version to X.Y.Z"
3. Creates a Git tag `vX.Y.Z`
4. Creates a GitHub Release with automatic changelog

### Manual Versioning (Minor & Major)

To increment **minor** or **major** version, use the yarn scripts:

#### Minor Version
```bash
yarn version:minor
```
Example: `1.0.5` → `1.1.0`

#### Major Version
```bash
yarn version:major
```
Example: `1.1.0` → `2.0.0`

These commands:
1. Update the `package.json`
2. Create a commit
3. Create a Git tag
4. Push the commit and tag

### Creating Tags Manually

You can also create Git tags manually:

```bash
# Create a tag for a new minor version
git tag v1.1.0
git push origin v1.1.0

# Create a tag for a new major version
git tag v2.0.0
git push origin v2.0.0
```

The GitHub Actions workflow will detect the tag and create the release automatically.

## Version Display in the App

The current version is displayed in the bottom right corner of the application via the `VersionComponent`.

### Customizing the Display

The component accepts various props to customize the display:

```tsx
<VersionComponent
  position="fixed"  // 'fixed' or 'static'
  bottom={10}       // Distance from bottom
  right={10}        // Distance from right
  opacity={0.5}     // Opacity (0-1)
  fontSize="0.75rem" // Font size
/>
```

## GitHub Releases

Each new version automatically generates:
- A Git tag `vX.Y.Z`
- A GitHub Release with:
  - Automatic changelog with all commits since the previous version
  - Bump type (patch/minor/major)
  - Links to commits

## Workflow

### Normal Development (Bug Fix / Small Changes)
```bash
git add .
git commit -m "fix: resolved loading issue"
git push
```
→ Automatic version bump: `1.0.0` → `1.0.1`

### New Feature (Minor)
```bash
# Make your commits normally
git add .
git commit -m "feat: added new feature X"
git push

# When you're ready to release the minor version
yarn version:minor
```
→ Version bump: `1.0.5` → `1.1.0`

### Breaking Changes (Major)
```bash
# Make your commits normally
git add .
git commit -m "feat!: reimplemented API with breaking changes"
git push

# When you're ready to release the major version
yarn version:major
```
→ Version bump: `1.1.0` → `2.0.0`

## Important Notes

1. **Avoid Conflicts**: The workflow skips commits that start with "chore: bump version" to avoid infinite loops
2. **GitHub Token**: The workflow uses the automatic `GITHUB_TOKEN`, no additional configuration needed
3. **Main Branch**: Automatic versioning only works on the `main` branch
4. **Changelog**: The changelog is automatically generated from commit messages between versions

## Troubleshooting

### Versioning doesn't work
- Verify you're on the `main` branch
- Check that GitHub Actions is enabled in the repository
- Verify the `GITHUB_TOKEN` permissions in the repository settings

### Version doesn't update in the app
- Verify that the build includes the updated `package.json` file
- Check that `resolveJsonModule: true` is present in `tsconfig.app.json`
- Do a fresh build: `yarn build`
