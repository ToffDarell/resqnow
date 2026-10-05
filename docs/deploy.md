# ResQNow — Deployment (TiDB + Render + Vercel)

One backend (`api/`) and one database serve both the web admin and the mobile app.

```
Vercel: web-admin  ─┐
                    ├─►  Render: api/ (Laravel, Docker)  ─►  TiDB
Vercel: ResQNow-App ┘
```

- Web admin talks to `https://resqnow-api.onrender.com/api/...` (unchanged).
- Mobile app (`ResQNow-App/frontend`) talks to `https://resqnow-api.onrender.com/api/app/...`
  with a bearer token. The frontend rewrites `/api/x` to `/api/app/x` itself.
- `ResQNow-App/backend` is the old standalone backend. It is **not deployed** any more;
  its endpoints were ported into `api/` (`app/Http/Controllers/Mobile`, `routes/mobile`).

## 1. Render (API)

Service `resqnow-api` is defined in `render.yaml` (Docker, `rootDir: api`). Set these env vars:

| Key | Value |
| --- | --- |
| `APP_KEY` | `php artisan key:generate --show` |
| `APP_URL` | `https://resqnow-api.onrender.com` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | from TiDB Cloud (port `4000`) |
| `MYSQL_ATTR_SSL_CA` | `/etc/ssl/certs/ca-certificates.crt` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | web-admin login (created on boot) |
| `FRONTEND_URL` | URL of the mobile app on Vercel, e.g. `https://resqnow-app.vercel.app` (password-reset links) |
| `MAIL_MAILER` / `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_FROM_ADDRESS` | SMTP so "Forgot password" can send email (default `log` sends nothing) |
| `RESPONDER_EMAIL` / `RESPONDER_PASSWORD` / `RESPONDER_NAME` | optional, creates a responder account + linked personnel |

On every boot the container runs `migrate --force` and the seeders (admin, responder, contact directory).
The mobile migration (`2026_10_02_000001_add_mobile_app_tables.php`) only adds tables/columns, so it is
safe on the existing TiDB database. Existing reports and users are kept.

## 2. Vercel (mobile app)

Project root: `ResQNow-App/frontend` (Vite). `vercel.json` and `.env.production` are included.
Env var: `VITE_API_URL=https://resqnow-api.onrender.com` (no trailing slash, no `/api`).

## 3. Vercel (web admin)

Unchanged: root `web-admin`, `VITE_API_URL=https://resqnow-api.onrender.com/api`.

## How the two sides connect

| Step | Web admin | Mobile app |
| --- | --- | --- |
| Resident signs up | Residents page shows it as `Pending` | "waiting for barangay verification" |
| Admin verifies resident | `verification_status = Verified` | resident can log in |
| Resident files a report | Report appears under *For Verification* | Report shows *Submitted* / *Pending Verification* |
| Admin verifies / returns report | Moves to *For Prioritization* / returned | Timeline gets *Verified* + notification |
| Admin creates incident and assigns personnel | Incident + personnel | Responder sees the assignment (personnel must be linked to a responder account) |
| Responder acts (start, en route, arrived, resolve) | Incident status follows | Resident gets progress notifications |
| Admin publishes an announcement | Announcements page | Shown in the app (Published, not expired) |

A responder account is linked to the web-admin personnel list through `personnels.user_id`
(`ResponderSeeder` does this for the `RESPONDER_*` account).

## Known limits

- Render free disk is ephemeral: report photos are stored on local disk and are lost on redeploy/restart.
  Use object storage (S3/R2) before relying on photo evidence.
- Render free sleeps after idle; the first request can take ~50 s.
- Password-reset emails need a real mailer (`MAIL_*`); the default `log` mailer sends nothing.
