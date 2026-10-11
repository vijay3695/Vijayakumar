#!/usr/bin/env bash
# ============================================================================
# Build the site and publish dist/ to the gh-pages branch.
#   npm run deploy
#
# Why a branch instead of a GitHub Actions workflow: the automation that
# authored this repo is not permitted to create files under .github/workflows/.
# A gh-pages branch needs no workflow and no extra permissions.
# ============================================================================
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
REMOTE_URL="$(git config --get remote.origin.url)"

if [ -z "$REMOTE_URL" ]; then
  echo "error: no git remote 'origin' configured" >&2
  exit 1
fi

echo "==> building"
npm run build

if [ ! -f dist/index.html ]; then
  echo "error: dist/index.html missing - build did not produce a site" >&2
  exit 1
fi

# The display picture is inlined as a data URI on purpose. If an image file ever
# appears in dist/, it is plainly downloadable - fail loudly rather than ship it.
STRAY=$(find dist -type f \( -iname 'avatar*' -o -iname 'dp.*' -o -iname 'profile-photo*' \) 2>/dev/null | head -5)
if [ -n "$STRAY" ]; then
  echo "error: the display picture is shipping as a file, not inlined:" >&2
  echo "$STRAY" >&2
  exit 1
fi
echo "    display picture: inlined (no image file in dist/)"

# who should the deploy commit be attributed to?
AUTHOR_NAME="$(git config user.name || echo 'unknown')"
AUTHOR_EMAIL="$(git config user.email || echo 'unknown')"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -r dist/. "$TMP/"

cd "$TMP"
git init -q -b gh-pages
# inherit the repo's configured identity so deploy commits are attributed the same
# way as source commits, instead of a synthetic "portfolio deploy" account
git config user.email "$AUTHOR_EMAIL"
git config user.name "$AUTHOR_NAME"
git add -A
git commit -q -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git remote add origin "$REMOTE_URL"

# gh-pages is a generated artifact branch, so replacing its history is expected
# and safe. The source of truth is the default branch.
echo "==> pushing to gh-pages"
git push --force origin gh-pages

echo "==> done"
echo "    live at: https://<your-username>.github.io/<repo-name>/"
echo "    (enable once: Settings -> Pages -> Source: Deploy from a branch -> gh-pages / root)"
