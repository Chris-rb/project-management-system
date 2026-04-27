# ============================================================
#  ProjectTracker — Docker Makefile
#  Usage: make <target>
#  Supports: macOS, Linux, Windows (Git Bash / WSL)
# ============================================================

COMPOSE         = docker compose
APP_NAME        = ProjectTracker
DOCKER_TIMEOUT  = 60

# ── Detect OS ───────────────────────────────────────────────
ifeq ($(OS),Windows_NT)
  PLATFORM := windows
else
  UNAME := $(shell uname -s)
  ifeq ($(UNAME),Darwin)
    PLATFORM := macos
  else
    PLATFORM := linux
  endif
endif

# ── Colours ─────────────────────────────────────────────────
RESET  = \033[0m
BOLD   = \033[1m
GREEN  = \033[32m
YELLOW = \033[33m
CYAN   = \033[36m
RED    = \033[31m

.DEFAULT_GOAL := help

# ============================================================
#  HELP
# ============================================================

.PHONY: help
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(APP_NAME) — Docker Commands$(RESET)"
	@echo ""
	@echo "$(BOLD)Setup$(RESET)"
	@echo "  make init           First-time project setup (.env file)"
	@echo ""
	@echo "$(BOLD)Development$(RESET)"
	@echo "  make up             Start all services (builds if needed)"
	@echo "  make up-build       Force rebuild and start all services"
	@echo "  make down           Stop all services"
	@echo "  make restart        Restart all services"
	@echo "  make restart-api    Restart only the API service"
	@echo "  make restart-client Restart only the client service"
	@echo ""
	@echo "$(BOLD)Logs$(RESET)"
	@echo "  make logs           Tail logs from all services"
	@echo "  make logs-api       Tail logs from the API"
	@echo "  make logs-client    Tail logs from the client"
	@echo "  make logs-db        Tail logs from the database"
	@echo "  make logs-nginx     Tail logs from nginx"
	@echo ""
	@echo "$(BOLD)Database$(RESET)"
	@echo "  make db-shell       Open a MySQL shell"
	@echo "  make db-backup      Dump the database to ./backups/"
	@echo "  make db-restore     Restore from the latest backup"
	@echo ""
	@echo "$(BOLD)Maintenance$(RESET)"
	@echo "  make status         Show status of all containers"
	@echo "  make clean          Stop services and remove containers + networks"
	@echo "  make clean-all      clean + remove volumes (wipes database)"
	@echo "  make prune          Remove unused Docker images and build cache"
	@echo ""


# ============================================================
#  DOCKER — cross-platform startup guard
# ============================================================

# Attempts to start Docker Desktop if not running, then waits
# until the daemon is ready. Behaviour varies by platform:
#   macOS   — launches Docker.app via `open`
#   Windows — launches Docker Desktop via `start`
#   Linux   — Docker is daemon-managed; prints a hint if down

.PHONY: docker-start
docker-start:
	@if ! docker info > /dev/null 2>&1; then \
		echo "$(YELLOW)► Docker is not running. Attempting to start it...$(RESET)"; \
		if [ "$(PLATFORM)" = "macos" ]; then \
			open -a Docker; \
		elif [ "$(PLATFORM)" = "windows" ]; then \
			start "" "C:/Program Files/Docker/Docker/Docker Desktop.exe" 2>/dev/null || \
			echo "$(YELLOW)  Could not auto-start Docker Desktop. Please start it manually.$(RESET)"; \
		else \
			echo "$(YELLOW)  Linux detected. Try: sudo systemctl start docker$(RESET)"; \
			echo "$(RED)✖ Please start the Docker daemon and re-run the command.$(RESET)"; \
			exit 1; \
		fi; \
		echo "$(YELLOW)► Waiting for Docker to be ready (max $(DOCKER_TIMEOUT)s)...$(RESET)"; \
		elapsed=0; \
		while ! docker info > /dev/null 2>&1; do \
			if [ $$elapsed -ge $(DOCKER_TIMEOUT) ]; then \
				echo "$(RED)✖ Docker did not start within $(DOCKER_TIMEOUT)s. Please start it manually.$(RESET)"; \
				exit 1; \
			fi; \
			sleep 2; \
			elapsed=$$((elapsed + 2)); \
			printf "$(YELLOW).$(RESET)"; \
		done; \
		echo ""; \
		echo "$(GREEN)✔ Docker is ready.$(RESET)"; \
	else \
		echo "$(GREEN)✔ Docker is already running.$(RESET)"; \
	fi


# ============================================================
#  SETUP
# ============================================================

.PHONY: init
init:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN)✔ .env created from .env.example.$(RESET)"; \
		echo "$(YELLOW)  Edit .env and set your DB credentials before running make up.$(RESET)"; \
	else \
		echo "$(YELLOW)  .env already exists — skipping.$(RESET)"; \
	fi


# ============================================================
#  DEVELOPMENT
# ============================================================

.PHONY: up
up: docker-start
	@echo "$(CYAN)► Starting all services...$(RESET)"
	@$(COMPOSE) up -d
	@echo ""
	@echo "$(GREEN)✔ Services are up.$(RESET)"
	@echo ""
	@echo "  Frontend  →  http://localhost:8000"
	@echo "  API       →  http://localhost:8000/api"
	@echo "  Swagger   →  http://localhost:8000/swagger"
	@echo ""

.PHONY: up-build
up-build: docker-start
	@echo "$(CYAN)► Rebuilding and starting all services...$(RESET)"
	@$(COMPOSE) up -d --build
	@echo ""
	@echo "$(GREEN)✔ Services rebuilt and up.$(RESET)"
	@echo ""
	@echo "  Frontend  →  http://localhost:8000"
	@echo "  API       →  http://localhost:8000/api"
	@echo "  Swagger   →  http://localhost:8000/swagger"
	@echo ""

.PHONY: up-clean-build
up-clean-build: docker-start
	@echo "$(CYAN)► Rebuilding and starting all services with clean build...$(RESET)"
	@$(COMPOSE) build --no-cache && $(COMPOSE) up -d
	@echo ""
	@echo "$(GREEN)✔ Services rebuilt and up.$(RESET)"
	@echo ""
	@echo "  Frontend  →  http://localhost:8000"
	@echo "  API       →  http://localhost:8000/api"
	@echo "  Swagger   →  http://localhost:8000/swagger"
	@echo ""

.PHONY: down
down: docker-start
	@echo "$(CYAN)► Stopping all services...$(RESET)"
	@$(COMPOSE) down
	@echo "$(GREEN)✔ All services stopped.$(RESET)"

.PHONY: restart
restart: docker-start
	@echo "$(CYAN)► Restarting all services...$(RESET)"
	@$(COMPOSE) restart
	@echo "$(GREEN)✔ All services restarted.$(RESET)"

.PHONY: restart-api
restart-api: docker-start
	@echo "$(CYAN)► Restarting API...$(RESET)"
	@$(COMPOSE) restart api
	@echo "$(GREEN)✔ API restarted.$(RESET)"

.PHONY: restart-client
restart-client: docker-start
	@echo "$(CYAN)► Restarting client...$(RESET)"
	@$(COMPOSE) restart nginx
	@echo "$(GREEN)✔ Client restarted.$(RESET)"


# ============================================================
#  LOGS
# ============================================================

.PHONY: logs
logs: docker-start
	@$(COMPOSE) logs -f --tail=100

.PHONY: logs-api
logs-api: docker-start
	@$(COMPOSE) logs -f --tail=100 api

.PHONY: logs-client
logs-client: docker-start
	@$(COMPOSE) logs -f --tail=100 nginx

.PHONY: logs-db
logs-db: docker-start
	@$(COMPOSE) logs -f --tail=100 db

.PHONY: logs-nginx
logs-nginx: docker-start
	@$(COMPOSE) logs -f --tail=100 nginx


# ============================================================
#  DATABASE
# ============================================================

.PHONY: db-shell
db-shell: docker-start
	@echo "$(CYAN)► Opening MySQL shell...$(RESET)"
	@$(COMPOSE) exec db mysql -u root -p$${DB_ROOT_PASSWORD} $${DB_NAME}

.PHONY: db-backup
db-backup: docker-start
	@mkdir -p backups
	@TIMESTAMP=$$(date +%Y%m%d_%H%M%S); \
	FILENAME="backups/backup_$$TIMESTAMP.sql"; \
	echo "$(CYAN)► Dumping database to $$FILENAME...$(RESET)"; \
	$(COMPOSE) exec -T db mysqldump -u root -p$${DB_ROOT_PASSWORD} $${DB_NAME} > $$FILENAME; \
	echo "$(GREEN)✔ Backup saved to $$FILENAME$(RESET)"

.PHONY: db-restore
db-restore: docker-start
	@LATEST=$$(ls -t backups/*.sql 2>/dev/null | head -1); \
	if [ -z "$$LATEST" ]; then \
		echo "$(RED)✖ No backup files found in ./backups/$(RESET)"; \
		exit 1; \
	fi; \
	echo "$(YELLOW)► Restoring from $$LATEST...$(RESET)"; \
	$(COMPOSE) exec -T db mysql -u root -p$${DB_ROOT_PASSWORD} $${DB_NAME} < $$LATEST; \
	echo "$(GREEN)✔ Database restored from $$LATEST$(RESET)"


# ============================================================
#  MAINTENANCE
# ============================================================

.PHONY: status
status: docker-start
	@echo "$(CYAN)► Container status:$(RESET)"
	@$(COMPOSE) ps

.PHONY: clean
clean: docker-start
	@echo "$(YELLOW)► Stopping services and removing containers + networks...$(RESET)"
	@$(COMPOSE) down --remove-orphans
	@echo "$(GREEN)✔ Cleaned up containers and networks.$(RESET)"

# `read -p` is not portable across all shells (e.g. dash on Linux).
# This uses `read` with a preceding `printf` for broad compatibility,
# including Git Bash on Windows, dash/bash on Linux, and zsh on macOS.
.PHONY: clean-all
clean-all: docker-start
	@echo "$(RED)► This will DELETE all containers, networks, and volumes (including the database).$(RESET)"
	@printf "  Are you sure? [y/N] "; \
	read confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		$(COMPOSE) down --volumes --remove-orphans; \
		echo "$(GREEN)✔ All containers, networks, and volumes removed.$(RESET)"; \
	else \
		echo "$(YELLOW)  Cancelled.$(RESET)"; \
	fi

.PHONY: prune
prune: docker-start
	@echo "$(YELLOW)► Removing unused Docker images and build cache...$(RESET)"
	@docker image prune -f
	@docker builder prune -f
	@echo "$(GREEN)✔ Docker images and build cache pruned.$(RESET)"