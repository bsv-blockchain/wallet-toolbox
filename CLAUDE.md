# CLAUDE.md

## CRITICAL: Multi-Package Repository

This repository contains **THREE npm packages** that must ALL be built and published together:

| Package | Directory | npm Name |
|---------|-----------|----------|
| Main | `/` (root) | `@bopen-io/wallet-toolbox` |
| Mobile | `/mobile` | `@bopen-io/wallet-toolbox-mobile` |
| Client | `/client` | `@bopen-io/wallet-toolbox-client` |

## Build Commands

```bash
# Build ALL packages (required before publishing)
npm run build              # Builds main package
tsc -p tsconfig.mobile.json  # Builds mobile package
tsc -p tsconfig.client.json  # Builds client package
```

## Publish Workflow

**EVERY release requires publishing ALL THREE packages:**

1. Update version in ALL package.json files (root, mobile/, client/)
2. Build ALL packages
3. Commit and push
4. Publish each package:

```bash
# From root directory
bun publish --access public --otp <code>

# From mobile directory
cd mobile && bun publish --access public --otp <code>

# From client directory
cd client && bun publish --access public --otp <code>
```

## Common Mistake

**DO NOT** publish only the main package. The mobile and client packages are used by downstream consumers (like `@1sat/wallet-toolbox` and `yours-wallet`). If you only publish the main package, the compiled output in mobile/client will be stale and mismatched.

## Version Sync

All three packages should have the same version number. Check with:

```bash
grep '"version"' package.json mobile/package.json client/package.json
```
