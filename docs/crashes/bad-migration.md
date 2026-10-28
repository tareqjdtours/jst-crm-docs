# A database update failed

**When to use this:** A deploy stopped, and the `migrate` box did not finish with `Exited (0)`.
**Time it takes:** 20 minutes
**You need:** A terminal on the server, and a backup from before the deploy.

## What this is

Every deploy first runs **migrate**, a helper that changes the database's shape
to match the new code (for example, adding a column). If it fails, the CRM
**refuses to start on purpose**. That protects the data: a new program on an old
database would give errors on every page.

## Before you start

- [ ] Do **not** try to repair the database by hand.
- [ ] Find the backup taken before the deploy ([Backups](../maintenance/backups.md)).

## Steps

1. Read why it failed:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml logs migrate
   ```

2. Copy the last 20 lines and send them to the developer. They will fix the update in the code.

3. To get staff working again **now**, go back to the last good version: [Go back](../deploy/rollback.md).

4. If the failed update *partly changed* the database (the log shows some steps succeeded before the error), the old program may not run on it. [Restore the backup](restore-database.md) taken before the deploy, *then* go back.

5. When the developer has fixed it, push the fix. The normal deploy runs the update again.

## Check it worked

- `migrate` shows `Exited (0)`.
- The CRM opens and you can sign in.

## If something goes wrong

| You see | Do this |
|---|---|
| `could not connect to server` in the migrate log | The database was not ready or is down: [The site is down](site-down.md) |
| The same failure after going back | Restore the pre-deploy backup |

_Last checked: YYYY-MM-DD_
