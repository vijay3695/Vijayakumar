#!/usr/bin/env bash
# ============================================================================
# Build and publish so that EITHER GitHub Pages configuration works:
#   main / (root)  -> built files committed at the repo root
#   main / docs    -> an identical copy committed under docs/
#
# The app source lives in app/, which is what frees the repo root to hold a
# servable build. Never force-pushes anything.
# ============================================================================
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> building"
npm run build

if [ ! -f dist/index.html ]; then
  echo "error: build produced no dist/index.html" >&2
  exit 1
fi

# The display picture is inlined on purpose - a file here would be plainly
# downloadable, so fail loudly rather than ship it.
STRAY=$(find dist -type f \( -iname 'avatar*' -o -iname 'dp.*' -o -iname 'profile-photo*' \) 2>/dev/null | head -5)
if [ -n "$STRAY" ]; then
  echo "error: the display picture is shipping as a file, not inlined:" >&2
  echo "$STRAY" >&2
  exit 1
fi

# sanity: the published entry must reference built assets, never the source
grep -q './assets/' dist/index.html || {
  echo "error: built index.html does not reference ./assets/ - refusing to publish" >&2
  exit 1
}

echo "==> publishing to repo root"
rm -rf assets
cp -r dist/assets assets
cp dist/index.html index.html
touch .nojekyll

echo "==> publishing to docs/"
rm -rf docs
cp -r dist docs
touch docs/.nojekyll

git add -A index.html assets .nojekyll docs
if git diff --cached --quiet; then
  echo "==> nothing changed"
  exit 0
fi

git commit -q -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push origin "$BRANCH"
echo "==> published to $BRANCH (root + docs/)"
