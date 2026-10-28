# The server is gone

**When to use this:** The machine died, was stolen, cannot be reached, or its disk is destroyed.
**Time it takes:** About an hour, plus waiting for downloads
**You need:** GitHub admin access, a new Linux machine, and the **latest backup copy that is stored off the server**.

!!! tip "This is why backups must be copied off the server"
    If the only backups were on the dead machine, the data may be gone.
    Check first: a laptop, a cloud drive, a colleague's computer.

## Before you start

- [ ] Find the newest `.dump` backup file. Note its date.
- [ ] Tell staff the CRM is down and roughly when it will be back.

## Steps

1. **Prepare a new machine.** Install Linux, then Docker and Docker Compose. Make sure it has a fixed address on the office network.

2. **Get the code.** Follow step 1 of [Deploy by hand](../deploy/manual.md).

3. **Connect it to GitHub's automatic deploy** (optional but best): on GitHub → the repo → **Settings** → **Actions** → **Runners** → **New self-hosted runner**, follow the instructions, and give it the same labels as the old one (ask the developer for them).

4. **Start the CRM** on an empty database: follow steps 2 to 4 of [Deploy by hand](../deploy/manual.md).

5. **Load the data:** follow [Restore the database](restore-database.md) with your newest backup.

6. **Restore the drivers' connection.** The drivers' phones reach the CRM through a secure tunnel run by Cloudflare. The new machine needs the tunnel program installed and signed in. Ask the developer; it needs the Cloudflare account.

7. **Tell staff the new address** if it changed.

## Check it worked

- You can sign in, open a recent file and run a report.
- A driver can sign in on their phone.
- A new backup has been taken and copied off the machine.

## If something goes wrong

| You see | Do this |
|---|---|
| No backup can be found | Check every device and cloud account the team uses. Contact the developer immediately. |
| The newest backup is old | Restore it anyway, then ask staff to re-enter work done since that date. |

## Afterwards

Write down how it happened, and fix the gap: automatic nightly backups that are
copied off the machine.

_Last checked: YYYY-MM-DD_
