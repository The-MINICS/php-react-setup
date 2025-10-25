## PHP Backend Documentation

## Overview
This is the backend API for the PHP + React fullstack project. It provides authentication, user management, role-based access, and health check endpoints. The backend is designed to run in Docker with Apache and PHP 8.2.

---

## Structure

```
backend/
├── index.php           # Main entry point
├── Dockerfile          # Docker setup
├── .htaccess           # Apache config
├── api/                # API endpoints (login, user, etc.)
├── src/                # Core PHP classes (Auth, Database, Response, etc.)
├── db-init/            # SQL initialization scripts
└── vendor/             # Composer dependencies
```

---

## Setup & Usage


### 1. Docker
After building the Docker image for the first time, you need to install PHP dependencies:
```sh
docker compose exec web composer install
```
Then start the backend server:
```sh
docker compose up -d
```
Access the API at `http://localhost:8000`

### 2. Environment Variables
- Configure JWT secret and other settings in `.env` or config files as needed.

### 3. Database
- Initialization scripts in `db-init/init.sql`
- Connects via `Database.php` class

---

## API Endpoints
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/users` — List users (admin only)
- `GET /api/health` — Health check

---

## Authentication & Authorization
- Uses JWT for authentication
- Role-based access (admin, user, etc.)
- Token required in `Authorization: Bearer <token>` header

---

## Docker & Apache
- Apache config allows `.htaccess` overrides
- CORS headers set for development
- PHP modules managed via Dockerfile

---

## Troubleshooting
- CORS errors: Check `.htaccess` and PHP headers
- 401/403 errors: Check JWT validity and role
- Docker issues: Rebuild with `docker compose build`
- Logs: `docker compose logs -f web` or check `/var/log/apache2/error.log` in container

---

## License
MIT

---

## Contact
For backend issues, open an issue or contact the maintainer.

