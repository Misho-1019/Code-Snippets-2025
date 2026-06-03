# Milestone 1 — Security & Critical Bug Fixes

## 1a. Fix Comment API — Public Endpoint Shouldn't Require Auth

**Problem:** `client/src/api/commentApi.ts:17` — `useComments()` uses `authRequest` (sends `X-Authorization` header), but the server endpoint `GET /snippets/:snippetId/comments` has no auth guard. Unauthenticated users get 401 when viewing comments.

**Fix in `client/src/api/commentApi.ts`:**
- Import `request` from `../utils/request`
- Replace `const { request: authRequest } = useAuth()` with `request`
- Change `authRequest.get(...)` → `request.get(...)`
- Keep `useAuth` import since `useCreateComments` and `useDeleteComment` still need it

## 1b. Remove localStorage Token Storage — Rely on httpOnly Cookies

**Problem:** Server sets JWT in `httpOnly` cookie (secure against XSS), but client stores the token in `localStorage` via `usePersistedState` and sends it as `X-Authorization` header — defeating httpOnly protection.

**Files to change:**

### Server: Add `GET /auth/me` endpoint in `server/src/controllers/authController.ts`
- Add `isAuth`-guarded route that returns current user data from `req.user`
- `authController.get('/me', isAuth, (req, res) => { ... })`
- Queries User model by `req.user.id`, returns `{ _id, email, username }`
- This allows the client to hydrate auth state on page reload from the httpOnly cookie

### Client: `client/src/providers/UserProvider.tsx`
- Replace `usePersistedState('auth', {})` with regular `useState`
- Initial state: `{ _id: '', email: '', username: '', token: '' }`
- On mount (`useEffect`), call `GET /auth/me` to hydrate state from cookie
- If `/auth/me` fails (no cookie), keep empty defaults
- `userLogoutHandler` clears state (already does this)
- `userLoginHandler` sets state from response (already does this)

### Client: `client/src/hooks/useAuth.ts`
- Remove `X-Authorization` header from `requestWrapper` — token is sent via cookie automatically
- The `credentials: 'include'` option is already set in `request.ts`

### Client: `client/src/api/authApi.ts`
- In `useLogout`, remove the `X-Authorization` header from options
- The cookie is sent automatically via `credentials: 'include'`

### Server: `server/src/controllers/authController.ts`
- Optionally stop returning `token` in response body for register/login
- Still set the httpOnly cookie
- (Keep returning it for backward compatibility if needed, or remove — client won't use it)

## 1c. Wrap JSON.parse in usePersistedState in try/catch

**File: `client/src/hooks/usePersistedState.ts:11`**

**Fix:**
```typescript
try {
    return JSON.parse(persistedState) as T
} catch {
    return typeof initialState === 'function' ? (initialState as () => T)() : initialState
}
```

## 1d. Fix request.ts — Handle Missing Content-Type Properly

**File: `client/src/utils/request.ts:33-35`**

**Problems:**
1. `if (!responseContentType) { return }` — returns `undefined` even on error responses
2. No error response handling before Content-Type check

**Fix:**
- Check `response.ok` FIRST
- If not OK, try to parse error JSON, fall back to text error message
- Only then check Content-Type for successful responses
- Handle 204 No Content / empty responses gracefully

## 1e. Fix Logout.tsx Inverted Logic

**File: `client/src/api/authApi.ts:46`**

`return { isLoggedOut: !!token }` — when token is truthy (user IS logged in), `isLoggedOut` is `true`. Inverted.

**Fix:** `return { isLoggedOut: !token }`

## 1f. Apply Rate Limiting to Mutation Endpoints

**File: `server/src/index.ts:54-67`**

Currently only `/auth` has rate limiting. Add limits to:
- `POST /snippets/create` — creation spam
- `POST/PUT/DELETE /snippets/:id` — mutations
- `POST /snippets/:id/comments` — comment spam
- `POST /snippets/:id/likes` — like spam

**Option A:** Apply `generalLimiter` (100 req/15min) to all non-auth routes — already used but only through `app.use(generalLimiter)` which applies to everything including auth. Actually looking at the code: `app.use('/auth', authLimiter)` is BEFORE `app.use(generalLimiter)`. So generalLimiter already applies to all routes. The issue is it's too permissive (100/15min is fine).

Actually, looking again at the code: `app.use(generalLimiter)` applies to all routes after this point. Since `app.use('/auth', authLimiter)` is before it, auth routes get both limiters applied. The general limiter of 100/15min is reasonable. Maybe the fix is to verify this is sufficient, or add a stricter mutation limiter (e.g., 30 req/15min for POST/PUT/DELETE).

**Fix:**
- Add a `mutationLimiter` with stricter limits (30 per 15 min) applied to mutation endpoints
- Or adjust `generalLimiter` to be stricter

## Implementation Order

1. `1d` — request.ts (no dependencies, foundational)
2. `1c` — usePersistedState.ts (no dependencies)
3. `1e` — authApi.ts (no dependencies)
4. `1a` — commentApi.ts (no dependencies)
5. `1b` — auth overhaul (depends on understanding auth flow)
6. `1f` — rate limiting (independent)
