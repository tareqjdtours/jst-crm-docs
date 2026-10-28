# Daily health check

**When to use this:** Every morning, or any time you want to be sure the CRM is OK.
**Time it takes:** 2 minutes
**You need:** A browser. A terminal on the server for the full check.

## Quick check (no terminal)

1. Open the CRM and sign in.
2. Open a recent file. It should load with its details.
3. Open the health address in the browser: `http://<server>:5180/api/v1/health/ready`

   You should see `{"status":"ok","db":"ok", ...}`.
   `"db":"down"` means the website is up but the database is not.

## Full check (on the server)

1. Go to the CRM folder (the one with `compose.yml`).

2. See every box:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml ps
   ```

   Good looks like: `db`, `api`, `web`, `driver-api` are `running` or `healthy`;
   `migrate` is `Exited (0)`.

3. Look at the latest messages from the api:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml logs --tail=50 api
   ```

   A few lines are normal. A long run of the word `ERROR` is not.

4. Check there is disk space left. A full disk stops the database.

   ```bash
   df -h
   ```

   Worry when the main disk is above about 85% used.

5. Check a recent backup exists. See [Backups](backups.md).

## If something goes wrong

| You see | Do this |
|---|---|
| A box is `restarting` or `unhealthy` | [The site is down](../crashes/site-down.md) |
| `db: down` | [The site is down](../crashes/site-down.md), step 4 |
| Disk above 85% | Tell the developer. Do **not** delete Docker volumes. |

_Last checked: YYYY-MM-DD_
