# React Frontend Documentation

## Overview
This is the frontend for the PHP + React fullstack project. Built with Vite, React 19, and TypeScript, it features authentication, protected routes, role-based access, and API integration with the PHP backend.

---

## Structure

```
frontend/
├── src/                # React source code
│   ├── components/     # UI and logic components
│   ├── context/        # Auth context and hooks
│   ├── pages/          # Page components (Home, Admin, User, etc.)
│   ├── utils/          # Axios instance, helpers
│   └── ...
├── public/             # Static assets
├── package.json        # NPM dependencies
├── vite.config.ts      # Vite config
└── README.md           # Documentation
```

---

## Setup & Usage

### 1. Install dependencies
```sh
cd frontend
npm install
```

### 2. Environment Variables
- Set `VITE_BACKEND_URL` in `.env` to match your backend API URL (e.g. `http://localhost:8000`)

### 3. Start development server
```sh
npm run dev
```
Access the app at `http://localhost:5173`

---

## Features
- Authentication with JWT
- Role-based protected routes (Admin/User)
- Context-based auth state
- Axios instance for API calls
- Tailwind CSS for styling

---

## Usage
- Login via `/login` page
- Access protected pages based on role
- Admin can view user list and manage users

---

## Troubleshooting
- CORS errors: Check backend CORS config
- 401/403 errors: Check token validity and role
- API errors: Ensure using `axiosInstance` for all API calls

---

## License
MIT

---

## Contact
For frontend issues, open an issue or contact the maintainer.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
