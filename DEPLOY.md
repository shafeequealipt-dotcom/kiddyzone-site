# Going live

Each step needs the owner's go-ahead.

**Done (2026-11-06):** domain `kiddyzone.in` bought (GoDaddy) and set in `store.json`; site uploaded by hand to `/var/www/kiddyzone` on the Oracle VM (`ssh oracle-billing`, 68.233.109.57); nginx config from `deploy/nginx-kiddyzone.in.conf` installed as `/etc/nginx/sites-available/kiddyzone.in`. GoDaddy DNS: A `@` → 68.233.109.57, CNAME `www` → `kiddyzone.in.`. HTTPS by certbot (auto-renews, dry run passed); www and http redirect to https://kiddyzone.in. **Live since 2026-11-06.** Repo: https://github.com/shafeequealipt-dotcom/kiddyzone-site (public). Every push to `main` builds and deploys via GitHub Actions as the server user `kzdeploy` (no sudo, owns only `/var/www/kiddyzone`, key in the `SSH_PRIVATE_KEY` repo secret). Steps 2–5 below are done. Blog agent: code in `/opt/kiddyzone-agent` (owned by server user `kzagent`, no sudo), site clone `/opt/kiddyzone-site`, pushes with a write deploy key (repo Settings → Deploy keys, revoke there). Keys in root-only `/etc/kiddyzone-agent.env`. Timer `kiddyzone-agent.timer` runs daily 09:00–12:00 IST; logs: `sudo journalctl -u kiddyzone-agent`. The server's `/opt/kiddyzone-agent/topics.md` is the live topic queue; the local copy is not synced.

1. **Domain.** Buy it, then set `url` in `src/data/store.json`. Everything else follows from that one value.
2. **Site repo.** Create a GitHub repo from this folder.
3. **Server.** Add an nginx site and web root on the Oracle VM, as for orpheusmedia.in. It's a shared server, so touch only this site's config and run `sudo nginx -t` before each reload. Add SSL with certbot. Check the current host first, because IPs in older notes have gone stale.
4. **Auto-deploy.** Add the secrets `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER` and `DEPLOY_PATH` in GitHub. `.github/workflows/deploy.yml` then deploys on every push.
5. **Blog agent.** Copy `../kiddyzone-agent` to `/opt/kiddyzone-agent`, create its `.venv`, and make a dedicated clone of the site repo for `REPO_DIR`.
   - Create root-only `/etc/kiddyzone-agent.env` (`chmod 600`) using the names in `.env.example`.
   - The GitHub token needs Contents read and write on the site repo only.
   - Run one post by hand and read it.
   - Install the units from `agent/deploy/`, then run `sudo systemctl enable --now kiddyzone-agent.timer`.
6. **Google.** Submit `/sitemap.xml` in Search Console. Add the site's URL to the shop's Google Business Profile, which currently has no website.
7. **Google Business posts (optional).** Run `python3 -m agent.gbp_auth login` and add the `KIDDYZONE_GBP_*` values.

Node 22 is used in CI.
