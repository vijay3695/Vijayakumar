#!/usr/bin/env bash
# Build and publish the Vite app directly to main/(root) for GitHub Pages.
# This script deliberately does not use GitHub Actions and does not publish docs/.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> building"
npm run build

if [ ! -f dist/index.html ]; then
  echo "error: build produced no dist/index.html" >&2
  exit 1
fi

STRAY=$(find dist -type f \( -iname 'avatar*' -o -iname 'dp.*' -o -iname 'profile-photo*' \) 2>/dev/null | head -5)
if [ -n "$STRAY" ]; then
  echo "error: the display picture is shipping as a file, not inlined:" >&2
  echo "$STRAY" >&2
  exit 1
fi

grep -q './assets/' dist/index.html || {
  echo "error: built index.html does not reference ./assets/ - refusing to publish" >&2
  exit 1
}

echo "==> publishing built site to main root"
rm -rf assets
cp -r dist/assets assets
cp dist/index.html index.html
touch .nojekyll

git add -A index.html assets .nojekyll
if git diff --cached --quiet; then
  echo "==> nothing changed"
  exit 0
fi

git commit -m "deploy: publish Vite build to main root"
git push origin "$BRANCH"
echo "==> published to $BRANCH root"
