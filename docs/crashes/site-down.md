# The site is down: first five minutes

**When to use this:** Staff cannot open the CRM, pages do not load, or everything shows errors.
**Time it takes:** 5 minutes to find the cause
**You need:** A terminal on the server ([how to connect](../connect.md)).

!!! tip "Stay calm, change one thing at a time"
    The data is safe in the database volume. Most problems are fixed by
    restarting. Do **not** delete anything.

## Set up your terminal

1. Go to the CRM folder (the one with `compose.yml`).
2. Docker needs to know which version is running. Find it:

   ```bash
   docker ps --format '{{.Image}}' | grep ghcr
   ```

   Then use it (replace with what you saw):

   ```bash
   export CRM_IMAGE=ghcr.io/tareqjdtours/jst-crm-backend:<code>
   ```

   If nothing is listed because everything is stopped, use the code of the last green deploy in GitHub's **Actions** tab.

## Steps

1. **Is anything running?**

   ```bash
   docker compose -f compose.yml -f compose.staging.yml ps
   ```

   Look for `db`, `api`, `web`. Any box that is `Exited`, `restarting` or `unhealthy` is the suspect. (`migrate` showing `Exited (0)` is fine.)

2. **Is the computer itself OK?**

   ```bash
   df -h
   ```

   A disk at 100% stops the database. Tell the developer; do not delete Docker volumes.

3. **Read the last messages.**

   ```bash
   docker compose -f compose.yml -f compose.staging.yml logs --tail=100 api db migrate
   ```

4. **Match what you see** with the table below.

5. **If unsure, do a clean restart.** It keeps all data.

   ```bash
   docker compose -f compose.yml -f compose.staging.yml down
   docker compose -f compose.yml -f compose.staging.yml up -d
   ```

   Never add `-v` to `down`: it erases the database.

## What you see and what to do

| You see | Meaning | Do this |
|---|---|---|
| Pages load but every action says **502** | The website lost track of the api | Clean restart (step 5) |
| `api` never starts; `migrate` is not `Exited (0)` | A database update failed | [A database update failed](bad-migration.md) |
| Errors about a *missing column or table* | New code, old database shape | `docker compose -f compose.yml -f compose.staging.yml run --rm migrate`, then restart |
| `db` is not running | Database stopped | Check the disk (step 2), then `up -d`. If it will not start: [Restore the database](restore-database.md) |
| "Too many attempts" (429) when signing in | Sign-in throttle | Wait a few minutes |
| Staff sign in but are signed out at once | The address is plain `http` and the cookie needs `https` | Ask the developer |
| Drivers cannot sign in, office is fine | The driver service or its tunnel | Check `curl http://127.0.0.1:8001/api/v1/driver/health`; ask the developer to check the tunnel |
| The whole server does not respond | Machine is off or the network is down | [The server is gone](server-lost.md) |
| A deploy just failed | New version did not start | [Go back](../deploy/rollback.md) |

## Check it worked

```bash
curl -fsS http://localhost:5180/api/v1/health/ready
```

You should see `"status":"ok"`. Then sign in from a browser and open a recent file.

## After it is fixed

- Write down what happened, what you did, and the times.
- Tell the team the site is back.
- Take a fresh [backup](../maintenance/backups.md).

_Last checked: YYYY-MM-DD_
