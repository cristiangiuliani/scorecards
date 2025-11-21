# GitHub Secrets Configuration

This document explains how to configure the required secrets for GitHub Actions workflows.

## Required Secrets

### For Codecov Integration (Optional)

If you want coverage reports uploaded to Codecov:

1. Go to [codecov.io](https://codecov.io/)
2. Sign in with your GitHub account
3. Add your repository
4. Get your **CODECOV_TOKEN**
5. Add it to GitHub Secrets:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Your token from Codecov
   - Click "Add secret"

**Note**: The workflow will still work without this token, but coverage won't be uploaded to Codecov.

### For Netlify Deployment

These secrets are already configured if your Netlify deployment is working:

- `NETLIFY_AUTH_TOKEN` - Your Netlify authentication token
- `NETLIFY_SITE_ID` - Your Netlify site ID

## Verifying Secrets

To verify your secrets are configured correctly:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. You should see:
   - ✅ `NETLIFY_AUTH_TOKEN`
   - ✅ `NETLIFY_SITE_ID`
   - ⚙️ `CODECOV_TOKEN` (optional)

## Workflows Overview

### test.yml
Runs on every push and PR:
- ✅ Linting
- ✅ Type checking
- ✅ Unit tests
- ✅ Coverage reports
- ⚙️ Codecov upload (if token configured)
- ⚙️ PR coverage comments (if token configured)

### netifly-hosting.yml
Runs on push to main and manual triggers:
- ✅ Tests (must pass)
- ✅ Build (only if tests pass)
- ✅ Deploy (manual trigger only)

## Troubleshooting

### Tests fail in CI but pass locally

1. Check Node.js version matches (should be 20)
2. Ensure all dependencies are in package.json
3. Check for environment-specific code
4. Review test logs in GitHub Actions

### Coverage upload fails

1. Verify `CODECOV_TOKEN` is set correctly
2. Check that `coverage/lcov.info` is generated
3. Review Codecov dashboard for errors
4. Ensure repository is added to Codecov

### Deployment fails

1. Verify Netlify secrets are correct
2. Check build logs in GitHub Actions
3. Ensure tests are passing
4. Verify Netlify site configuration

## Disabling Codecov (if not needed)

If you don't want to use Codecov, you can remove these sections from `.github/workflows/test.yml`:

```yaml
# Remove these steps:
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  ...

- name: Comment PR with coverage
  uses: romeovs/lcov-reporter-action@v0.3.1
  ...
```

The tests will still run and generate local coverage reports.
