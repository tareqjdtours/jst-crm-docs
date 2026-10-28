# How a deploy happens (CI/CD)

**When to use this:** You want to know what happens when code is pushed, or why a deploy turned red.
**Time it takes:** 5 minutes to read

## The idea in one line

When a developer pushes code to the `main` branch on GitHub, robots test it,
package it and put it on the server. Nobody has to log in to the server.
**CI/CD** is just the name for this: *continuous integration* (test it) and
*continuous delivery* (ship it).

## The three stages

Open the repo's **Actions** tab on GitHub to watch them. Each stage must pass
before the next one starts.

1. **Test.** A temporary database is created and the automatic tests run.
   If a test fails, nothing is shipped. The live site is not touched.
2. **Build.** The code is packaged into an *image* (a sealed copy of the
   program) and stored on GitHub, labelled with the commit's unique code.
3. **Deploy.** The deploy machine downloads that image, stops the old CRM,
   starts the new one, and then asks the CRM "are you healthy?" every 10
   seconds for up to two minutes.

!!! warning "The site is briefly down during stage 3"
    The old version is stopped before the new one starts, usually for a minute
    or two. Deploy outside office hours when you can. Data is kept: the
    database volume is never removed.

## The front end is shipped with the backend

The website's screens (the front end) live in a separate repository, but they
are built *during the backend's deploy*. So:

!!! tip
    Pushing a front-end change on its own does **not** update the live site.
    Re-run the backend workflow: GitHub → **Actions** → **Backend CI** → open
    the latest run → **Re-run all jobs**.

## Check it worked

- All three stages show a green tick in the Actions tab.
- The last step says "Staging is healthy!".
- Open the CRM in a browser and sign in.

## If something goes wrong

| You see | Do this |
|---|---|
| Red at **Test** | A code problem. Tell the developer. The live site is unaffected. |
| Red at **Build** | A packaging problem. Re-run the job once; if it fails again, tell the developer. |
| Red at **Deploy**, "Staging failed health verification" | The new version did not start. The old one is already stopped, so the site is down. Follow [The site is down](../crashes/site-down.md), then [Go back](rollback.md). |
| Stuck on "Waiting for a runner" | The deploy machine is off or offline. Use [Deploy by hand](manual.md). |

_Last checked: YYYY-MM-DD_
