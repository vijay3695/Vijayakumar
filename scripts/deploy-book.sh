#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "==> copying book to index.html"
cp openzine-book.html index.html
touch .nojekyll

git add -A index.html .nojekyll
if git diff --cached --quiet; then
  echo "==> nothing changed"
  exit 0
fi

git commit -m "deploy: publish OpenZine book to main root"
git push origin main
echo "==> published"
