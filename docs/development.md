# Development Guide — Code Snippets

## Prerequisites

- **Node.js** 22+
- **MongoDB** 8+ (local or Atlas)
- **Git**

## Setup

```bash
git clone <repo-url>
cd Code-Snippets-2025

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Environment Variables

Copy `.env.example` to `server/.env` and fill in:

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | (required) |
| `MONGO_URI` | MongoDB connection string | (required) |
| `PORT` | Server port | `3030` |
| `CORS_ORIGIN` | Frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |

## Running Locally

Open **two terminals**:

```bash
# Terminal 1 — Express API server
cd server
npm run dev

# Terminal 2 — Vite React dev server
cd client
npm run dev
```

The app is at **http://localhost:5173**. The API is at **http://localhost:3030/api**.

Vite proxies `/api/*` requests to the Express server, so API calls work from the client without CORS issues.

## Seed Database

```bash
cd server
npm run seed
```

Creates demo users (`alice` / `bob`, password: `password123`) and 5 sample snippets.

## Project Structure

```
Code-Snippets-2025/
├── server/                        # Express 5 + MongoDB + TypeScript
│   └── src/
│       ├── index.ts               # App bootstrap, middleware chain, startup
│       ├── routes.ts              # Route mounting (auth + snippets + health)
│       ├── controllers/           # Route handlers (authController, snippetController)
│       ├── services/              # Business logic (auth, snippets, comments, likes)
│       ├── models/                # Mongoose schemas (User, Snippet, Comment)
│       ├── middlewares/           # auth, CSRF, error handler, mongo sanitize
│       ├── validators/            # Zod request validation schemas
│       ├── utils/                 # Swagger/OpenAPI config
│       └── __tests__/             # Vitest + supertest API tests
├── client/                        # React 19 + Vite + Tailwind + TypeScript
│   └── src/
│       ├── api/                   # Custom hooks for API calls
│       ├── components/            # Page components and shared UI
│       ├── context/               # UserContext, ThemeContext
│       ├── hooks/                 # useAuth, useTheme, usePersistedState
│       ├── providers/             # UserProvider
│       ├── types/                 # TypeScript interfaces
│       └── utils/                 # request wrapper, toast utility
└── docs/                          # Project documentation
```

## Architecture

- **Layered backend**: Controllers → Services → Models, with middlewares for auth/CSRF/validation
- **Zod validation**: Request bodies and query params validated before reaching controllers
- **CSRF protection**: Double-submit cookie pattern on all mutation routes
- **JWT auth**: httpOnly cookie with secure + sameSite flags; `isAuth`/`isGuest` route guards
- **Rate limiting**: Separate limits for auth (10/min) and mutations (30/15min)

## Running Tests

```bash
# Server tests (Vitest + supertest + mongodb-memory-server)
cd server
npm test           # run once
npm run test:watch # watch mode

# Client tests (Vitest + jsdom)
cd client
npm test
```

## Building for Production

```bash
# Build server
cd server && npm run build    # → dist/

# Build client
cd client && npm run build    # → dist/
```

## Linting

```bash
cd client && npm run lint     # ESLint
```

## API Documentation

When running in development mode, Swagger UI is available at:

**http://localhost:3030/api-docs**
