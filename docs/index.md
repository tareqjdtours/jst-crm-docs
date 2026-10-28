# JST CRM Runbook

How to deploy, look after and fix the CRM. Written for whoever is on duty,
including when the usual person is away.

!!! danger "Something is broken right now?"
    Go straight to **[The site is down: first five minutes](crashes/site-down.md)**.

## Pick what you need

| I want to... | Go to |
|---|---|
| Understand how code reaches the server | [How a deploy happens](deploy/automatic.md) |
| Deploy when automation is down | [Deploy by hand](deploy/manual.md) |
| Undo a bad release | [Go back](deploy/rollback.md) |
| Check the CRM is healthy | [Daily health check](maintenance/health-checks.md) |
| Back up the data | [Take and copy a backup](maintenance/backups.md) |
| Bring data back | [Restore the database](crashes/restore-database.md) |

## Who to contact

_(Name, phone, role. Fill this in.)_

!!! warning "Keep this site free of secrets"
    GitHub Pages sites are public. Never write passwords, keys, IP addresses
    or customer data on these pages.
