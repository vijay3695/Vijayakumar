#!/usr/bin/env bash
# ============================================================================
# Build the site and publish it to main:/docs
#
# That is the folder GitHub Pages serves when the source is set to
# "Deploy from a branch -> main -> /docs".
#
# Deliberately NO force-push. An earlier version of this script force-pushed a
# gh-pages branch, which silently destroyed a deployment made by another agent
# (and the display picture with it). Committing into docs/ cannot do that.
# ============================================================================
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
BRANCH="${DEPLOY_BRANCH:-main}"

echo "==> building"
npm run build

if [ ! -f dist/index.html ]; then
  echo "error: dist/index.html missing - build did not produce a site" >&2
  exit 1
fi

# The display picture is inlined on purpose. An image file here would be plainly
# downloadable, so fail loudly rather than ship it.
STRAY=$(find dist -type f \( -iname 'avatar*' -o -iname 'dp.*' -o -iname 'profile-photo*' \) 2>/dev/null | head -5)
if [ -n "$STRAY" ]; then
  echo "error: the display picture is shipping as a file, not inlined:" >&2
  echo "$STRAY" >&2
  exit 1
fi

echo "==> syncing dist/ -> docs/"
rm -rf docs
cp -r dist docs
touch docs/.nojekyll

git add -A docs
if git diff --cached --quiet; then
  echo "==> nothing changed, nothing to publish"
  exit 0
fi

git commit -q -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push origin "$BRANCH"
echo "==> published to $BRANCH:/docs"
echo "    (Pages must be set to: Deploy from a branch -> $BRANCH -> /docs)"
