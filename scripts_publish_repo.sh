#!/usr/bin/env bash
set -euo pipefail
cd /root/ci-project/public_repo/CI-AGENT-CI-Dashboard

REPO="alansolache/CI-AGENT-CI-Dashboard"

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated. Run: gh auth login" >&2
  exit 1
fi

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repo exists: $REPO"
else
  gh repo create "$REPO" --public --description "CI-AGENT / CI Dashboard" --confirm
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "git@github.com:${REPO}.git"
else
  git remote add origin "git@github.com:${REPO}.git"
fi

git push -u origin main

echo "Pushed https://github.com/${REPO}"
echo "Next: connect this repo to Cloudflare Pages project ci-agent-ci-dashboard."
