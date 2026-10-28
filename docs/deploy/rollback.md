# Go back to the last working version

**When to use this:** A new version broke something and you need the old one back.
**Time it takes:** 10 minutes
**You need:** A terminal on the server; the commit code of the last good version.

## Before you start

- [ ] [Take a backup](../maintenance/backups.md) of the current database.
- [ ] Find the **last good version's commit code**: GitHub → **Actions** → pick the last run that worked → copy the code after the colon in the image name, or the commit code on that run.

!!! warning "Going back does not undo database changes"
    Each deploy may change the database's shape. Going back runs the *old
    program* on the *new database shape*. This usually works, but if the change
    removed something the old program needs, you must also
    [restore the database](../crashes/restore-database.md) from the backup
    taken *before* the bad deploy.

## Steps

1. Open a terminal on the server and go to the CRM folder (the one with `compose.yml`).

2. Set the old version and the settings (see [Deploy by hand](manual.md), step 2):

   ```bash
   export CRM_IMAGE=ghcr.io/tareqjdtours/jst-crm-backend:<old-commit-code>
   ```

3. Download it:

   ```bash
   docker pull "$CRM_IMAGE"
   ```

4. Restart on the old version:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml down
   docker compose -f compose.yml -f compose.staging.yml up -d --build
   ```

## Check it worked

- `docker compose -f compose.yml -f compose.staging.yml ps` shows all boxes running.
- Open the CRM and sign in; open a recent file.

!!! danger "The next push redeploys the new code"
    The server now runs the old version, but GitHub's `main` still holds the
    bad code. Ask the developer to fix or revert it before the next push, or
    the bad version comes back.

## If something goes wrong

| You see | Do this |
|---|---|
| Errors mention a missing column or table | The database is ahead of the code. [Restore the database](../crashes/restore-database.md). |
| Cannot pull the old image | It may have been deleted. Build it from the old commit: see "Building the image yourself" in [Deploy by hand](manual.md). |

_Last checked: YYYY-MM-DD_
