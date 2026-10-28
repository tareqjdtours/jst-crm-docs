# JST CRM Runbook

How to deploy, look after and fix the CRM. Written for whoever is on duty,
including when the usual person is away. You do not need to be an engineer:
every page is a short list of steps you can follow one at a time.

!!! danger "Something is broken right now?"
    Go straight to **[The site is down: first five minutes](crashes/site-down.md)**.

## Pick what you need

| I want to... | Go to |
|---|---|
| Open a terminal on the server | [Connect with SSH](connect.md) |
| Understand how code reaches the server | [How a deploy happens](deploy/automatic.md) |
| Deploy when automation is down | [Deploy by hand](deploy/manual.md) |
| Undo a bad release | [Go back](deploy/rollback.md) |
| Check the CRM is healthy | [Daily health check](maintenance/health-checks.md) |
| Back up the data | [Take and copy a backup](maintenance/backups.md) |
| Change a password or key | [Passwords and keys](maintenance/secrets.md) |
| Bring data back | [Restore the database](crashes/restore-database.md) |

## What the CRM is made of

Think of it as five boxes that run together on one server:

| Box | What it does |
|---|---|
| **web** | The website staff open. It is the part you see in the browser. |
| **api** | The brain. It receives what staff do and talks to the database. |
| **db** | The database. All the files, accounts and money records live here. |
| **migrate** | A helper that updates the database's shape on every deploy, then stops. It is *meant* to show as "Exited". |
| **driver-api** | A separate service for the drivers' phone app. |

All five are run by a tool called **Docker Compose**. A **volume** is the folder
Docker keeps data in, so the data survives when a box is restarted. The two
that matter are the **database** volume and the **backups** volume.

## The golden rules

1. **Back up before any risky change.** See [Backups](maintenance/backups.md).
2. **Never delete a Docker volume.** Never run `docker compose down -v` or
   `docker volume prune` on the server. That erases the database.
3. **Read the error before you act.** Most problems are solved by the
   [site-down page](crashes/site-down.md).
4. **Write down what you did**, with the time, so the next person knows.

## Who to contact

_(Name, phone, role. Fill this in.)_

!!! warning "Keep this site free of secrets"
    GitHub Pages sites are public. Never write passwords, keys, IP addresses
    or customer data on these pages.
