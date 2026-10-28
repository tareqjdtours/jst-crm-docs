# Change a password or key

**When to use this:** A password was shared by mistake, someone left the team, or a staff member is locked out.
**Time it takes:** 10 minutes
**You need:** GitHub admin access to the CRM repository (for keys) or a terminal on the server (for a user's password).

## A staff member is locked out or forgot their password

There is no email reset link. An administrator sets a new one from the server.

1. Go to the CRM folder (the one with `compose.yml`).
2. Run this, replacing the email:

   ```bash
   docker compose -f compose.yml -f compose.staging.yml run --rm migrate uv run --no-sync python scripts/reset_password.py someone@example.com
   ```

3. Type the new password when asked. It will not show on screen. Minimum 8 characters.
4. Tell the person the temporary password in person or by phone, never by email. The command also signs them out everywhere.

## Sign everyone out (a key was leaked)

The sign-in key (`JWT_SECRET`) proves that a sign-in is genuine. Changing it
logs **everyone** out, including drivers.

1. On GitHub: the CRM backend repo → **Settings** → **Environments** → **staging** → edit the secret `JWT_SECRET` and paste a new long random value.
2. Re-run the deploy: **Actions** → **Backend CI** → latest run → **Re-run all jobs**.

!!! note
    The staff service and the driver service must use the **same** key.
    The deploy sets both from the same secret, so this happens automatically.

## Other secrets

| Secret | Where it lives | What changing it does |
|---|---|---|
| `POSTGRES_PASSWORD` | GitHub environment secret | Needs the database's own password changed too. Ask the developer; do not change it alone. |
| `SEED_ADMIN_PASSWORD` | GitHub environment secret | Only used when creating the very first admin. |
| E-invoicing keys | GitHub environment settings | Ask the developer. |

## Check it worked

- The person can sign in with the new password.
- After a key change, you are asked to sign in again.

## If something goes wrong

| You see | Do this |
|---|---|
| "Password too short" | Use 8 or more characters. |
| "No such user" | Check the email spelling. |

_Last checked: YYYY-MM-DD_
