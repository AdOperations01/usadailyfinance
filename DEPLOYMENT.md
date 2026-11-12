# Hostinger deployment

The website source is inside `public_html/`. Hostinger's native Git integration deploys the entire repository, so it must remain paused. Do not use Redeploy. Never deploy the repository root or use a deletion sync: the server has separately managed folders, including `australia/`.

## Deployment credentials

The workflow is manual only, and defaults to a dry run. It does not deploy on pushes. These GitHub Actions secrets are configured for the authorized Hostinger SSH account:

- `HOSTINGER_HOST`: SSH hostname or IP from hPanel.
- `HOSTINGER_USER`: SSH username from hPanel.
- `HOSTINGER_PORT`: port from hPanel (script default 65002).
- `HOSTINGER_SSH_KEY`: the dedicated authorized deployment private key. Never commit it.
- `HOSTINGER_KNOWN_HOSTS`: verified known_hosts entry including the nonstandard port. Confirm the fingerprint independently with Hostinger; do not blindly trust ssh-keyscan output.

Confirm the account's `domains/usadailyfinance.com/public_html/` is the actual live root. The workflow intentionally uses this fixed destination, not a configurable arbitrary directory. SSH and rsync must be available, and enough storage must remain for a complete live-root backup.

## First run

1. Review and merge this change, then run **Safe Hostinger deployment** on `main` with `dry-run` selected.
2. Review all listed files against the server. Preserve any newer live edits in Git before applying. Two observed ACA HTML edits have already been copied into this change; this is not a complete server audit.
3. Run the same reviewed commit with `apply` only after reviewing the preview. A complete backup is copied outside the web root before uploads begin. Uploads use temporary files and delayed renames, never delete remote files, and explicitly exclude `australia/`.
4. Check the workflow health checks and real campaign landing pages. Retain the printed private backup path.

This avoids serving partially uploaded individual files, but is not a transaction across the whole website. For related breaking asset changes, use versioned assets or a separately tested release-switch architecture. Do not claim guaranteed zero downtime from FTP/rsync alone.

## Recovery

The workflow prints the full backup path before applying. Inspect it and restore affected files by copying them to temporary sibling paths and renaming into place. Do not clear the live root. New files are not removed automatically. Full backups consume space; review retention manually.

## Incident changes on 2026-11-12

Hostinger auto-deployment was paused. Git metadata, README.md, and .gitignore were moved outside the public web root. A dedicated deployment key was authorized with owner confirmation, and GitHub Actions secrets were configured. Existing campaign pages were not replaced during setup. The empty nested `public_html/` directory is harmless and can remain until normal housekeeping.
