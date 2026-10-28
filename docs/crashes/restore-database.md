# Restore the database from a backup

**When to use this:** Data was lost or damaged, a bad update broke the database, or you are rebuilding a server.
**Time it takes:** 20 minutes
**You need:** A terminal on the server and a backup file (`.dump`). See [Backups](../maintenance/backups.md).

!!! danger "This replaces everything in the live database"
    Anything entered after the backup was taken is **lost**. Tell staff to stop
    using the CRM first. If the database still starts, take a fresh backup of
    it before you begin, in case you restore the wrong file.

## Before you start

- [ ] Staff told to stop working in the CRM.
- [ ] You know which backup file you are restoring and when it was taken.
- [ ] The file is on the server. If it is inside the CRM's backups folder, copy it out:

  ```bash
  docker compose -f compose.yml -f compose.staging.yml cp api:/app/var/backups/<backup-name> ./restore.dump
  ```

## Steps

1. Go to the CRM folder (the one with `compose.yml`). Set the settings if needed (see [The site is down](site-down.md), "Set up your terminal").

2. Stop everything that uses the database:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml stop api driver-api web
   ```

3. Empty the database:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml exec -T db psql -U jst -d postgres -c "DROP DATABASE jst_crm_staging;" -c "CREATE DATABASE jst_crm_staging;"
   ```

4. Load the backup:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml exec -T db pg_restore -U jst -d jst_crm_staging --no-owner < restore.dump
   ```

   A few warning lines are usually harmless. A line starting with `error` that stops the command is not.

5. Start everything again:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml up -d
   ```

## Check it worked

- `docker compose -f compose.yml -f compose.staging.yml ps` shows all boxes running.
- Sign in and open a **recent file**. Check its details look right.
- Open a report, such as the trial balance, and check the totals look reasonable.
- Tell staff which date and time the data goes back to, so they can re-enter anything missing.

## If something goes wrong

| You see | Do this |
|---|---|
| `database ... is being accessed by other users` at step 3 | Step 2 did not stop everything. Run step 2 again and check with `ps`. |
| `pg_restore: error: input file does not appear to be a valid archive` | Wrong file, or it was damaged while copying. Try another backup. |
| `psql: not found` or `service "db" is not running` | Start only the database: `docker compose -f compose.yml -f compose.staging.yml up -d db`, wait a minute, retry. |
| The api starts but shows errors about missing columns | The backup is from before a database update. Run `docker compose -f compose.yml -f compose.staging.yml run --rm migrate` then restart. |

_Last checked: YYYY-MM-DD_
