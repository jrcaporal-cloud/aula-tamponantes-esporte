#!/usr/bin/env bash
# Publica a aula no GitHub Pages: testa, compila e envia dist/ para o branch gh-pages.
# (O deploy por GitHub Actions exige token com escopo "workflow"; este caminho só precisa de "repo".)
set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE="$(git remote get-url origin)"
npm test
npm run build
touch dist/.nojekyll

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R dist/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git commit -q -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE" gh-pages
echo "Publicado em https://jrcaporal-cloud.github.io/aula-tamponantes-esporte/"
