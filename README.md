# PHP + React Fullstack Setup

## Overview
This project is a fullstack web application using a PHP backend and a React (Vite + TypeScript) frontend. It includes authentication, role-based access, protected routes, and API integration.

---

## Project Structure

```
php-react-setup/
├── backend/         # PHP API backend
│   ├── index.php
│   ├── Dockerfile
│   ├── .htaccess
│   ├── api/
│   ├── src/
│   └── ...
├── frontend/        # React frontend (Vite + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
└── README.md        # Project documentation
```

---

## Getting Started

### 1. Backend (PHP)
- Docker-based Apache + PHP 8.2
- JWT authentication
- Role-based access control
- CORS configured for dev

**Run backend:**
```sh
cd backend
# Build and start containers
docker compose up -d
```

### 2. Frontend (React)
- Vite + React 19 + TypeScript
- Tailwind CSS for styling
- Role-based protected routes
- Axios for API calls

**Run frontend:**
```sh
cd frontend
npm install
npm run dev
```

---

## Authentication & Authorization
- JWT token stored in localStorage
- AuthProvider context syncs state from token
- ProtectedRoute component for role-based access
- Admin can access all routes, other roles limited

---

## API Endpoints (Backend)
- `/api/auth/login` — Login, returns JWT
- `/api/users` — Get user list (admin only)
- `/api/health` — Health check

---

## Environment Variables
- Frontend: `VITE_BACKEND_URL` in `.env`
- Backend: Secret key for JWT in `.env` or config

---

## Useful Commands
- `docker compose up -d` — Start backend
- `npm run dev` — Start frontend
- `docker compose logs -f web` — Backend logs

---

## Troubleshooting
- CORS errors: Check backend `.htaccess` and PHP headers
- 401/403 errors: Check JWT validity and role
- Axios: Ensure using `axiosInstance` for API calls

---

## License
MIT

---

## Contributors
- @all (team)

---

## Contact
For questions or support, open an issue or contact the maintainer.
