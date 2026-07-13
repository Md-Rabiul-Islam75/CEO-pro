# Running CEO-pro with Docker

The app is a stateless Next.js 16 container — **all content and uploaded images
live in Postgres**, so nothing is stored on the container filesystem. On start,
the container runs `prisma migrate deploy` (applying any pending migrations) and
then serves the site on port **3000**.

## 1. Quick start (self-contained: app + bundled Postgres)

```bash
docker compose up --build
# then open http://localhost:3000
```

This launches two services:

| Service | What it is                          |
|---------|-------------------------------------|
| `app`   | The Next.js site (port 3000)        |
| `db`    | Postgres 17 with a named volume `pgdata` (data persists across restarts) |

The bundled DB starts **empty**, so the site shows the built-in default content
until you add your own in the admin. Migrations run automatically.

> **Change the credentials** (`ceo` / `ceo_local_password`) in
> `docker-compose.yml` before exposing this anywhere.

Useful commands:

```bash
docker compose up -d --build     # run in the background
docker compose logs -f app       # follow app logs
docker compose down              # stop (keeps the DB volume)
docker compose down -v           # stop AND delete the DB volume (wipes data)
```

## 2. Using an external / managed Postgres

To point the app at your own Postgres instead of the bundled one:

1. In `docker-compose.yml`, set the `app` service's `DB_HOST`, `DB_PORT`,
   `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` to your database (or set a
   single `DATABASE_URL`, which takes precedence).
2. Remove the `db` service and the `depends_on` block (you no longer need it).

The app will run `prisma migrate deploy` against that database on startup.

## 3. Running the image on its own (no compose)

```bash
docker build -t ceo-pro .
docker run --rm -p 3000:3000 --env-file .env.docker ceo-pro
```

Copy `.env.docker.example` → `.env.docker` and fill in the database values
first. (`.env.docker` is git-ignored.)

## Notes

- **Schema**: the app uses the Postgres schema `ceo` (set via `DB_SCHEMA`);
  `prisma migrate deploy` creates it if needed.
- **Migrations run automatically** on container start. To run them manually
  instead, remove the `migrate deploy` line from `docker-entrypoint.sh` and run
  `docker compose run --rm app npx prisma migrate deploy` yourself.
- **Health check**: `GET /api/health` returns `{ "status": "ok" }` and backs the
  compose healthcheck.
- **Secrets**: `.env` / `.env.docker` are never copied into the image
  (`.dockerignore`); pass configuration via environment variables at runtime.
