# Deploying to cPanel (zeus2.its.ac.id)

Inbound FTP (21) and SSH (22/2222) are blocked by the ITS firewall; only the
cPanel UI on 2083 answers. CI cannot push files to the server, so the server
pulls from GitHub over outbound HTTPS instead:

```
push to main -> GitHub Actions builds -> commits dist/ -> cPanel pulls -> public_html
```

cPanel's clone is pinned to `main` and cPanel 110 cannot retarget a cloned
repository at another branch, which is why build output is committed in-tree at
`dist/` rather than on a separate deploy branch. cPanel cannot build the site
itself -- the account has no Node runtime.

## Moving parts

| Where | What |
|---|---|
| `.cpanel.yml` | Tells cPanel to copy `dist/` into `public_html`. Must sit on the checked-out branch or cPanel reports "The system cannot deploy". |
| `.github/workflows/deploy.yml` | Builds on push to `main`, commits the result to `dist/`. |
| `deploy/.htaccess` | Apache rules replacing the `headers()` block, which Next ignores under `output: "export"`. Copied into `dist/.htaccess` by CI. |
| `scripts/build-cpanel.sh` | Manual fallback: builds and zips for upload via File Manager. |

Keep `deploy/.htaccess` in sync with `SECURITY_HEADERS` and the cache rules in
`next.config.ts` -- they are mirrors of each other.

The `paths-ignore: dist/**` filter in the workflow stops CI's own deploy commit
from retriggering the workflow. Removing it causes an infinite build loop.

## Repositories

cPanel clones **`rivalITS/website-landingpage`**, not the personal fork. CI must
run there or its output never reaches the server:

```sh
git remote add rival https://github.com/rivalITS/website-landingpage.git
git push rival main
```

## One-time setup

### 1. DNS

`rival.its.ac.id` returns NXDOMAIN, which is what the warning beside **Primary
Domain** in cPanel refers to. Ask ITS network admin (zone SOA contact is
`itsnet.its.ac.id`) to add:

```
rival.its.ac.id.  A  202.46.129.204
```

Nothing else makes the site publicly reachable until this record exists.

### 2. First build

Push `.cpanel.yml` and the workflow to `main` on the org repo. Confirm
`dist/index.html` and `dist/.htaccess` appear on GitHub before touching cPanel.

### 3. Clear the web root

Back up and empty `public_html` if anything is already serving there.
Deployment copies over the top rather than replacing, so leftovers would be
served alongside the new site.

### 4. Deploy

cPanel -> Git Version Control -> Manage -> Pull or Deploy: **Update from
Remote**, then **Deploy HEAD Commit**.

## Automating the pull

cPanel has no webhook receiver. A cron job polls instead -- cPanel -> Cron Jobs,
`*/15 * * * *`:

```sh
cd /home/rivalits/repositories/website-landingpage && git pull --ff-only -q && /usr/local/cpanel/bin/uapi VersionControlDeployment create repository_root=repositories/website-landingpage >/dev/null 2>&1
```

Leave the cron email populated for the first few runs so failures are visible.
If `git` is not on cron's PATH, try `/usr/local/cpanel/3rdparty/bin/git`. If the
UAPI call misbehaves, drop it and let cron copy directly:

```sh
cd /home/rivalits/repositories/website-landingpage && git pull --ff-only -q && /bin/cp -R dist/* /home/rivalits/public_html/ && /bin/cp dist/.htaccess /home/rivalits/public_html/
```

Without cron, deploying is two clicks after each build.

## Known tradeoffs

- Deployment copies without deleting, so content-hashed chunks from old builds
  accumulate under `public_html/_next/`. Harmless; clear it out occasionally.
- Image optimization is off (`images.unoptimized`) -- the Next optimizer needs a
  running server.
- `<Analytics />` from `@vercel/analytics` posts to `/_vercel/insights/*`, which
  does not exist off Vercel; every pageview 404s silently.
- `public/archive/originals/` is 44MB of unreferenced source images that ship on
  every deploy.
