# PHP Modern API

A modern PHP API setup using Docker, Apache, and PostgreSQL.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

1. **Clone this repository:**
   ```sh
   git clone <repo-url>
   cd php-modern-api
   ```

2. **Configure environment variables:**

   Create a `.env` file in the project root with the following content:
   ```
   POSTGRES_USER=youruser
   POSTGRES_PASSWORD=yourpassword
   POSTGRES_DB=yourdb
   DB_HOST=db
   DB_PORT=5432
   ```

3. **Start the application:**
   ```sh
   docker-compose up --build
   ```

4. **Access the API:**

   - PHP API: [http://localhost:8000](http://localhost:8000)
   - PostgreSQL: `localhost:5432` (from your host)

## Project Structure

- `Dockerfile` - PHP 8.2 + Apache setup
- `docker-compose.yaml` - Multi-container orchestration (web + db)
- `db-init/` - Place any SQL scripts here to initialize the database

## Useful Commands

- Stop containers: `docker-compose down`
- Install dependencies: `docker-compose exec web composer install`

## Notes

- Source code is mounted as a volume for live development.
- Apache mod_rewrite is enabled for clean URLs.

