# API Reference

Base URL: `http://localhost:3030/api`

## Authentication

All auth tokens are JWT stored in an `httpOnly` cookie named `auth`. Tokens expire after 2 hours.

### POST /auth/register
Register a new user. Guest-only (must not be logged in).

**Body:** `{ username: string, email: string, password: string }`
**Response 201:** `{ token: string, _id: string, email: string, username: string }`
**Response 400:** `{ message: string }`

### POST /auth/login
Log in with email and password.

**Body:** `{ email: string, password: string }`
**Response 200:** `{ token: string, _id: string, email: string, username: string }`
**Response 400:** `{ message: string }`

### GET /auth/me
Get current authenticated user. Auth required.

**Response 200:** `{ _id: string, email: string, username: string }`
**Response 401:** `{ message: "Unauthorized" }`

### GET /auth/logout
Log out. Auth required.

**Response 200:** `{ message: "Logout successfully!" }`

---

## Snippets

### GET /snippets
List snippets with pagination, filtering, and text search.

**Query params:** `page` (default 1), `limit` (default 10, max 100), `search` (text search), `language`, `tag`

**Response 200:**
```json
{
    "snippets": [{ "_id", "title", "description", "code", "language", "tags", "creator", "createdAt", "likes" }],
    "totalPages": 1,
    "currentPage": 1,
    "totalSnippets": 5
}
```

### GET /snippets/latest
Get most recent snippets.

**Query params:** `sortBy` (createdAt|title|language), `order` (asc|desc), `pageSize` (default 3)
**Response 200:** `[{ ...snippet }]`

### GET /snippets/languages
Get language counts.

**Response 200:** `[{ "name": "JavaScript", "count": 3 }, ...]`

### GET /snippets/tags
Get all tags with usage counts (top 30).

**Response 200:** `[{ "name": "react", "count": 5 }, ...]`

### GET /snippets/:snippetId
Get a single snippet.

**Response 200:** `{ ...snippet }`
**Response 404:** `{ error: "Snippet not found!" }`

### POST /snippets/create
Create a snippet. Auth required.

**Body:** `{ title, description, code, language, tags?: string[] }`
**Response 201:** `{ ...snippet }`
**Response 400:** `{ error: string }`

### PUT /snippets/:snippetId
Update a snippet. Auth required. Owner only.

**Body:** `{ title?, description?, code?, language?, tags? }`
**Response 200:** `{ ...updatedSnippet }`
**Response 403:** `{ error: "Unauthorized!" }`

### DELETE /snippets/:snippetId
Delete a snippet. Auth required. Owner only. Cascade-deletes associated comments.

**Response 200:** `{ message: "Snippet deleted successfully!" }`
**Response 403:** `{ error: "Unauthorized!" }`

---

## Comments

### GET /snippets/:snippetId/comments
Get all comments for a snippet.

**Response 200:** `[{ _id, text, creator: { _id, username }, snippetId, createdAt }]`

### POST /snippets/:snippetId/comments
Add a comment. Auth required.

**Body:** `{ text: string }`
**Response 201:** `{ ...comment }`

### DELETE /snippets/:snippetId/comments/:commentId
Delete a comment. Auth required. Owner only.

**Response 200:** `{ message: "Comment deleted successfully!" }`
**Response 403:** `{ error: "Unauthorized!" }`

---

## Likes

### POST /snippets/:snippetId/likes
Toggle like/unlike on a snippet. Auth required.

**Response 200:** `{ likesCount: number, likedByUser: boolean }`

---

## Health

### GET /health
Health check endpoint (no auth required).

**Response 200:** `{ status: "ok", db: "connected" | "disconnected", uptime: number }`

---

## Error Format

All errors follow one of two formats:

```json
{ "message": "Human-readable message" }
{ "error": "Human-readable message" }
```

Validation errors return field-level detail:
```json
{ "errors": [{ "field": "title", "message": "Title must be at least 3 characters" }] }
```

## Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Auth routes | 10 requests | 1 minute |
| Mutation routes | 30 requests | 15 minutes |

## Security

- **CSRF protection**: Double-submit cookie pattern on all mutation routes
- **MongoDB injection**: `$` and `.` prefixed query keys are stripped
- **JWT**: httpOnly, secure, sameSite cookie; 2-hour expiry
- **CORS**: Configurable origin with credentials support
