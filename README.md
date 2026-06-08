# 💻 Code-Snippets-2025
### Full-Stack Code Snippet Manager & Developer Knowledge Base

A production-oriented full-stack web application designed to **save, organize, search, and share code snippets with syntax highlighting, tags, comments, and likes**.

This project focuses on **real-world development workflows, secure authentication, social engagement features, and polished UX** — not just basic CRUD operations.

---

## 🎯 Project Purpose

Developers constantly accumulate useful code snippets — a React hook pattern, a CSS utility, a SQL query — scattered across local files, notes apps, and browser tabs.

**Code-Snippets-2025** addresses this by:

- providing a centralized library for saving and organizing snippets
- enabling full-text search with language and tag filtering
- offering a professional code editor (CodeMirror 6) with syntax highlighting
- supporting social engagement through comments, likes, and public profiles
- allowing snippet forking and GitHub Gist export for sharing
- delivering a fast, dark-mode-capable, keyboard-driven experience

The system is designed to simulate a **real developer tool**, where code is treated as a reusable asset rather than throwaway text.

---

## 🚀 Core Features

### Snippet Management

- Create, edit, and delete snippets with title, description, code, and language
- Full-text search across titles and descriptions
- Filter by programming language or custom tags
- Paginated catalog with windowed navigation
- Public / private visibility control per snippet

### Editor & UX

- CodeMirror 6 editor with JavaScript, TypeScript, Python, CSS, HTML, and JSON highlighting
- Dark and light theme that follows system preference
- Chip-based tag input with autocomplete suggestions
- Command palette (Ctrl+K) for instant navigation and actions
- Unsaved changes warning on create/edit forms
- Skeleton loading states and page transitions

### Social & Discovery

- Language count sidebar + tag cloud for filtering
- Comments on snippets with owner-only deletion
- Like/unlike toggle with atomic updates
- Public user profiles showing shared snippets
- Snippet forking — create your own copy of any public snippet
- One-click export to GitHub Gist

### Security & Reliability

- JWT authentication via httpOnly cookies with secure + sameSite flags
- CSRF double-submit cookie protection on all mutation routes
- Rate limiting per auth and mutation endpoints
- MongoDB injection sanitization on body and query
- Helmet security headers
- Zod validation on all API inputs
- Health check endpoint with DB connection status
- 54 automated tests (Vitest + supertest + mongodb-memory-server)

---

## 🌐 Live Demo

- **Frontend (Vercel):** https://code-snippets-2025.vercel.app
- **Backend API (Render):** https://code-snippets-2025.onrender.com

> ⚠️ Note:
> This is a portfolio deployment.
> The backend is hosted on a free tier (Render), so cold starts may occur after inactivity.

---

## 🖼️ Screenshots

### 1️⃣ Home Page & Latest Snippets

![Home Page](views/Screenshot%202026-06-08%20181003.png)

### 2️⃣ Catalog & Search

![Catalog Page](views/Screenshot%202026-06-08%20181017.png)

### 3️⃣ Snippet Details & Code Editor

![Details Page](views/Screenshot%202026-06-08%20232357.png)

### 4️⃣ Create / Edit Snippet

![Create Page](views/Screenshot%202026-06-08%20190637.png)

---

## 🏗️ Architecture Overview

The application follows a layered client–server architecture:

### Client Layer (React 19 + Vite)

- Component-based UI with page transitions and skeleton loaders
- Context-based state management for authentication and theme
- Custom hooks for API communication with AbortController support
- Routing with protected routes for authenticated pages
- Command palette, onboarding overlay, and keyboard shortcut infrastructure

### Backend API (Express 5 + TypeScript)

- RESTful endpoints for snippets, auth, comments, likes, and user profiles
- Service-layer architecture for business logic separation
- Validation middleware via Zod with body and query schemas
- Layered middleware chain: Helmet → CORS → rate limit → CSRF → auth → routes → error handler

### Validation Layer (Zod)

- Request body and query parameters validated before reaching controllers
- Type coercion for pagination and filter parameters
- Consistent error format with field-level validation details

### Data Layer (MongoDB + Mongoose)

- Snippets with text index for full-text search
- Tags and language indexes for filtered queries
- Aggregation pipelines for language counts and tag clouds
- User-scoped data with owner checks on all mutations

---

## 🛠️ Tech Stack

### Frontend

- React 19 (Vite)
- Tailwind CSS 3
- React Router 7
- CodeMirror 6
- react-toastify
- react-hook-form + yup

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB + Mongoose
- Zod
- JWT (jsonwebtoken + bcrypt)
- Helmet, cors, express-rate-limit

### Deployment

- Frontend & Backend: local / self-hosted
- Database: MongoDB (Atlas or local)

---

## 🔒 Security Considerations

- JWT stored in httpOnly cookies with secure + sameSite flags
- CSRF double-submit cookie pattern on all mutation routes
- Rate limiting: 10 req/min for auth, 30 req/15min for mutations
- MongoDB operator injection prevention (`$`-key stripping on body and query)
- Helmet security headers on all responses
- CORS restricted to configured frontend origin
- Zod input validation on all API endpoints
- Owner verification on all destructive actions (edit, delete snippet, delete comment)

---

## ▶️ Running Locally

### 1️⃣ Backend

```bash
cd server
npm install
npm run dev
```

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
```

### 3️⃣ Environment Variables

#### Backend `.env`

```env
JWT_SECRET=your-secret-key-change-in-production
MONGO_URI=mongodb://localhost:27017/code-snippets
PORT=3030
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4️⃣ Seed Demo Data

```bash
cd server
npm run seed
```

Creates users `alice` / `bob` (password: `password123`) with 5 sample snippets.

### 5️⃣ Run Tests

```bash
cd server && npm test    # 43 API tests
cd client && npm test    # 11 unit tests
```

---

## 🗄️ API Reference

Base URL: `http://localhost:3030/api`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login |
| GET | `/auth/me` | ✅ | Current user |
| GET | `/auth/logout` | ✅ | Logout |
| GET | `/snippets` | — | List with pagination, search, language/tag filter |
| GET | `/snippets/latest` | — | Most recent snippets |
| GET | `/snippets/explore` | — | Public snippets |
| GET | `/snippets/languages` | — | Language counts |
| GET | `/snippets/tags` | — | Top 30 tags by usage |
| GET | `/snippets/:id` | — | Single snippet |
| POST | `/snippets/create` | ✅ | Create snippet |
| PUT | `/snippets/:id` | ✅ | Update (owner only) |
| DELETE | `/snippets/:id` | ✅ | Delete (owner only) |
| POST | `/snippets/:id/fork` | ✅ | Fork a snippet |
| POST | `/snippets/:id/likes` | ✅ | Toggle like |
| GET | `/snippets/:id/comments` | — | Get comments |
| POST | `/snippets/:id/comments` | ✅ | Add comment |
| DELETE | `/snippets/:id/comments/:cid` | ✅ | Delete comment (owner only) |
| GET | `/users/:username` | — | User profile + public snippets |
| GET | `/health` | — | Health check |

Swagger UI available at `/api-docs` in development mode.

---

## 🌱 Future Improvements

- Export to PNG (code screenshot like Carbon/Ray.so)
- VS Code extension for capturing snippets from the editor
- React Query migration for server-state caching and deduplication
- Batch snippet import/export
- Markdown export with syntax-highlighted code blocks
- Mobile-responsive UX enhancements
- Snippet collections / folders
- Revision history for snippets

---

## 👤 Author Note

Built with a production mindset, focusing on security, developer UX, and real-world code management workflows.

This project demonstrates applied full-stack architecture with **secure authentication, social engagement features, professional code editing, and thorough test coverage** — reflecting real production scenarios beyond basic CRUD applications.
