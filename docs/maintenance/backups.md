# Take and copy a backup

**When to use this:** Every day, and always before a risky change (a deploy, a go-back, a restore).
**Time it takes:** 5 minutes
**You need:** A CRM login with the backup permission, or a terminal on the server.

## Why two steps

A backup is a single file with a copy of the whole database. But if it stays on
the same server as the database, a broken server takes both. **Always keep at
least one copy somewhere else** (another computer, a cloud drive).

## Steps: from the CRM

1. Sign in and open **System Control → Database Backup**.
2. Type a name (letters, numbers, dash and underscore only, for example `before-update-2026-11-01`) and click **Take backup**.
3. When it appears in the list, **download it** and save it somewhere safe off the server.

## Steps: from the server

1. Go to the CRM folder (the one with `compose.yml`).
2. Make a dated backup file:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml exec -T db pg_dump -U jst -Fc jst_crm_staging > jst_crm-$(date +%F).dump
   ```

3. Copy the file off the server (for example with `scp`, or a cloud drive).

### Copy the backups taken from the CRM screen

```bash
docker compose -f compose.yml -f compose.staging.yml cp api:/app/var/backups ./backups-copy
```

## Check it worked

- The file exists and is **not tiny** (a few kilobytes means it failed).
- Check its size: `ls -lh jst_crm-*.dump`.
- A backup you have never restored is a hope, not a backup. Once, on a spare
  machine, follow [Restore the database](../crashes/restore-database.md).

!!! warning "Uploaded documents"
    Contracts and scans uploaded to the CRM are stored as files, **separate
    from the database**. A database backup does not contain them. Ask the
    developer to confirm where they are kept on the server and include that
    folder in your copies.

## Make it automatic (optional)

Ask the developer to schedule the server command above every night, and to
delete copies older than about 30 days.

## If something goes wrong

| You see | Do this |
|---|---|
| "backup_unavailable" or "backup_failed" in the CRM | The disk may be full (`df -h`). Use the server command instead. |
| "backup already exists" | Pick a different name. |
| `service "db" is not running` | The database is stopped: [The site is down](../crashes/site-down.md). |

_Last checked: YYYY-MM-DD_
