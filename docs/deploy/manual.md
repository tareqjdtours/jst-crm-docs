# Deploy by hand

**When to use this:** The automatic deploy is down, or you are setting up a new server.
**Time it takes:** 20 minutes
**You need:** A terminal on the server, Docker installed, the GitHub repo access, and the three CRM secrets (database password, signing key, first-admin password) from whoever holds them.

!!! note "Normally you do not do this"
    Pushing to `main` deploys automatically. See [How a deploy happens](automatic.md).

## Before you start

- [ ] [Take a backup](../maintenance/backups.md) if the CRM is already running.
- [ ] Decide which version to deploy. Each version is labelled with a commit code, visible in the GitHub **Actions** tab.

## Steps

1. **Get the code.** Skip if it is already on the server.

   ```bash
   git clone git@github.com:tareqjdtours/jst-crm-backend.git
   cd jst-crm-backend
   git clone git@github.com:tareqjdtours/jst-crm-frontend.git
   ```

   The front end must sit *inside* the backend folder, named `jst-crm-frontend`.

2. **Give the terminal its settings.** Replace each `...` with the real value. Never save these in a file in the repo.

   ```bash
   export POSTGRES_PASSWORD=...
   export JWT_SECRET=...
   export SEED_ADMIN_PASSWORD=...
   export JOFOTARA_MODE=off
   export CRM_IMAGE=ghcr.io/tareqjdtours/jst-crm-backend:<commit-code>
   ```

   These last only until you close the terminal.

3. **Log in to GitHub's image store and download the version.** Use a GitHub token that can read packages.

   ```bash
   echo <github-token> | docker login ghcr.io -u <github-username> --password-stdin
   docker pull "$CRM_IMAGE"
   ```

4. **Start everything.** Always include **both** `-f` files.

   ```bash
   docker compose -f compose.yml -f compose.staging.yml up -d --build
   ```

   - `-d` runs it in the background.
   - `--build` rebuilds the website part.

5. **New server only:** create the first admin and the starting lists.

   ```bash
   docker compose -f compose.yml -f compose.staging.yml exec api uv run --no-sync python scripts/seed_reference.py --admin-email you@example.com
   ```

## Check it worked

```bash
docker compose -f compose.yml -f compose.staging.yml ps
```

- Every box says `running` or `healthy`.
- `migrate` says `Exited (0)`. That is **correct**; it is a one-time job.

```bash
curl -fsS http://localhost:5180/api/v1/health/ready
```

You should see `"status":"ok"`. Then open `http://<server>:5180` and sign in.

## Building the image yourself

Only if GitHub's image store is unavailable. In the backend folder:

```bash
docker build -t crm-local:manual .
export CRM_IMAGE=crm-local:manual
```

Then do step 4. If your computer and the server have different processor types
(for example a Mac with an M-chip and a normal Linux server), build on the
server itself, or add `--platform linux/amd64`. Tag with the commit code so you
can tell later what is running.

## If something goes wrong

| You see | Do this |
|---|---|
| `invalid reference format` or a warning about unset variables | Step 2 was skipped. Set the variables again in this terminal. |
| `denied` when pulling | The GitHub token is wrong or cannot read packages. |
| Site loads but every action gives **502** | Run `docker compose -f compose.yml -f compose.staging.yml down` then step 4 again. |
| `migrate` is not `Exited (0)` | See [A database update failed](../crashes/bad-migration.md). |

_Last checked: YYYY-MM-DD_
