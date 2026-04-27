# ProjectTracker

A project management system with a .NET API, a TypeScript/React client, and MySQL — all wired together with Docker Compose and an nginx reverse proxy.

## Stack

- **API** — ASP.NET Core (`ProjectTracker.API`, `ProjectTracker.Core`)
- **Client** — TypeScript / React, built with Vite (`ProjectTracker.Client`)
- **Database** — MySQL 8
- **Reverse proxy** — nginx (serves the built client and proxies `/api` to the API)

## Prerequisites

You only need these two installed locally:

- **Docker Desktop** (or Docker Engine + Compose plugin on Linux) — everything runs in containers
- **Make** — already on macOS/Linux; on Windows, use Git Bash or WSL

You do *not* need .NET, Node, or MySQL installed on the host. The containers handle all of it.

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Chris-rb/project-management-system.git
cd project-management-system
```

### 2. Create your `.env` file

The repo ships with a `.env.example` that contains the required variables. Copy it to create your own `.env`:

```bash
cp .env.example .env
```

> 💡 Or just run `make init`, which does the copy for you.

Open `.env` and review the values. The defaults work out of the box, but you'll want to change the passwords for anything beyond a local dev environment:

| Variable | What it is |
|---|---|
| `DB_ROOT_PASSWORD` | MySQL root password |
| `DB_NAME` | Database name (default: `ProjectTrackerDb`) |
| `DB_USER` | Application DB user |
| `DB_PASSWORD` | Password for `DB_USER` |
| `VITE_API_URL` | API base URL the client builds against |


### 3. Start everything

```bash
make up
```

This builds the images (first run only) and starts the database, API, client build, and nginx. Once it's up:

- **Frontend** → http://localhost:8000
- **API** → http://localhost:8000/api
- **Swagger** → http://localhost:8000/swagger

That's it — the system is running locally.

## Useful Make commands

The Makefile has a lot more in it, but here's what you'll actually use day-to-day:

```bash
make help        # Full list of available commands
make up          # Start everything
make down        # Stop everything
make logs        # Tail logs from all services
make status      # See which containers are running
make up-build    # Force a rebuild (use after pulling changes that touch Dockerfiles or dependencies)
make clean-all   # Nuke everything including the database volume — useful for a clean reset
```

Run `make help` any time you need a refresher — it lists logging, database (backup/restore/shell), and cleanup targets too.

## Troubleshooting

- **Port 8000 already in use** → stop whatever else is using it, or change the host port in `docker-compose.yml` under the `nginx` service (`"8000:80"` → `"<your-port>:80"`).
- **Containers won't start / DB connection errors** → check `make logs-db` and `make logs-api`. Most often this is a typo in `.env` or a stale volume from a previous run; `make clean-all` followed by `make up` resolves it.

## Project layout

```
.
├── ProjectTracker.API/      # ASP.NET Core web API + Dockerfile
├── ProjectTracker.Core/     # Shared domain / business logic
├── ProjectTracker.Client/   # React + TypeScript frontend (Vite)
├── nginx/                   # nginx reverse proxy config
├── docker-compose.yml       # Service definitions
├── Makefile                 # Dev workflow shortcuts
└── .env.example             # Copy to .env before first run
```