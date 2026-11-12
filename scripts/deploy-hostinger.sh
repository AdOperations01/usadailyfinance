#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mode=${DEPLOY_MODE:-dry-run}
[[ "$mode" == dry-run || "$mode" == apply ]] || { echo 'Invalid mode'; exit 1; }
: "${HOSTINGER_HOST:?Set HOSTINGER_HOST}"
: "${HOSTINGER_USER:?Set HOSTINGER_USER}"
port=${HOSTINGER_PORT:-65002}
[[ "$HOSTINGER_HOST" =~ ^[a-zA-Z0-9.-]+$ && "$HOSTINGER_HOST" != -* ]] || exit 1
[[ "$HOSTINGER_USER" =~ ^[a-zA-Z0-9_]+$ ]] || exit 1
[[ "$port" =~ ^[0-9]+$ ]] || exit 1
[[ -f public_html/index.html && -d public_html/aca && -d public_html/debt ]] || exit 1
# Host key must already be independently verified; never disable checking.
ssh_args=(-p "$port" -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=20)
remote="$HOSTINGER_USER@$HOSTINGER_HOST"
# Fixed relative destination prevents accidental deployment into another domain.
destination=domains/usadailyfinance.com/public_html
ssh "${ssh_args[@]}" "$remote" 'set -eu; cd "$HOME/domains/usadailyfinance.com"; test -d public_html; test ! -L public_html; test -f public_html/index.html; test -d public_html/aca; command -v rsync >/dev/null'
if [[ "$mode" == apply ]]; then
  # Complete copy outside the web root before changing any live files.
  ssh "${ssh_args[@]}" "$remote" 'set -eu; umask 077; cd "$HOME/domains/usadailyfinance.com"; mkdir -p .deployment-backups; backup=$(mktemp -d .deployment-backups/release-XXXXXXXX); cp -a public_html "$backup/"; printf "Backup: %s/%s/public_html\n" "$PWD" "$backup"'
fi
args=(-rc --itemize-changes --human-readable --delay-updates
  --exclude='/.git/' --exclude='/.github/' --exclude='/.DS_Store'
  --exclude='**/.DS_Store' --exclude='/australia/'
  --chmod=D755,F644)
[[ "$mode" == apply ]] || args+=(--dry-run)
# Trailing slash uploads contents only. Never add --delete or --inplace.
rsync "${args[@]}" -e "ssh -p $port -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=20" public_html/ "$remote:$destination/"
if [[ "$mode" == apply ]]; then
  for path in / /aca/usa-en-1/ /aca/usa-en-3/ /debt/debt-en-1/ /ppc/debt-en-11/ /nb/auto-insurance/en-1/; do
    code=$(curl --silent --show-error --location --max-time 30 --output /dev/null --write-out '%{http_code}' "https://usadailyfinance.com$path")
    [[ "$code" == 200 ]] || { echo "Health check failed: $path ($code). Restore from the printed backup."; exit 1; }
  done
fi
