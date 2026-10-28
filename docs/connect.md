# Connect to the server (SSH)

**When to use this:** Any page that says "open a terminal on the server".
**Time it takes:** 5 minutes (first time: 15)
**You need:** The server's address and your username, from the person who manages access. A computer on the office network (or the VPN, if you use one).

## What SSH is

SSH lets you type commands on the server from your own computer, over a
secure connection. You do not need to be in the same room as the server.

!!! warning "The address and username are not on this site"
    This site is public, so the real server address and usernames are kept
    private. Ask the developer for them, or look in the team's password
    manager. In the steps below, replace `<username>` and `<server-address>`.

## Before you start

- [ ] You have your **username** and the **server address** (a name like `crm-server.local` or numbers like `192.168.x.x`).
- [ ] You are on the office network or connected to the VPN.
- [ ] Your computer has a terminal: **Mac** (open *Terminal*), **Windows 10/11** (open *PowerShell*), **Linux** (any terminal). All three already include SSH.

## Steps: the first time

1. **Create your own key** (a digital ID card for your computer). Skip if you have done this before. When it asks for a passphrase, choose one and remember it.

   ```bash
   ssh-keygen -t ed25519 -C "your-name-laptop"
   ```

   Press Enter to accept the default file location.

2. **Show your public key** and copy the whole line it prints (starts with `ssh-ed25519`).

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

   On Windows PowerShell use `type $env:USERPROFILE\.ssh\id_ed25519.pub`.

3. **Send the public key to the person who manages the server.** They add it to the server. Send only the `.pub` file's contents.

   !!! danger "Never share the private key"
       The file **without** `.pub` (`id_ed25519`) stays on your computer.
       Never send it, paste it in chat, or put it on GitHub.

4. **Connect.**

   ```bash
   ssh <username>@<server-address>
   ```

5. The first time, it asks:

   ```text
   Are you sure you want to continue connecting (yes/no)?
   ```

   Type `yes` and press Enter. This only happens once per server.

6. Enter your key's passphrase if asked. You are in when the prompt changes to something like `username@server:~$`.

7. **Go to the CRM folder** (the one that contains `compose.yml`). Ask the developer for its location, then:

   ```bash
   cd <crm-folder>
   ls
   ```

   You should see `compose.yml` in the list.

## Make it shorter next time

Create or edit the file `~/.ssh/config` on your computer and add:

```text
Host crm
    HostName <server-address>
    User <username>
```

Now you only type:

```bash
ssh crm
```

## Check it worked

```bash
hostname
docker compose version
```

The first shows the server's name, not your computer's. The second shows a
Docker version. Now you can follow any page on this site.

## Leaving the server

```bash
exit
```

Always exit when you are done. Do not leave a connection open and unattended.

## Safety rules

- Only use your **own** key. Never share keys or logins.
- Do not type a command you do not understand. Ask first.
- Never run `docker compose down -v` or `docker volume prune`: they erase the database.
- If your laptop is lost or stolen, tell the person managing the server **at once** so they remove your key.

## If something goes wrong

| You see | Do this |
|---|---|
| `Connection timed out` | You are not on the office network or VPN, or the server is off. Check your network, then see [The server is gone](crashes/server-lost.md). |
| `Connection refused` | The server is on, but SSH is not running or the address is wrong. Ask the developer. |
| `Permission denied (publickey)` | Your key was not added yet, or you used the wrong username. Send your **public** key again and check the username. |
| `Host key verification failed` or a big warning about `REMOTE HOST IDENTIFICATION HAS CHANGED` | The server was rebuilt or something is wrong. **Stop** and ask the developer. Do not just delete the warning. |
| `Could not resolve hostname` | Typo in the address, or you are off the network. |
| `Too many authentication failures` | Use `ssh -o IdentitiesOnly=yes <username>@<server-address>`. |

_Last checked: YYYY-MM-DD_
