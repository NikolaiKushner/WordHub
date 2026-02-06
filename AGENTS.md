# AI Coding Rules

This file defines project-wide rules and placement guidance for AI agents
working in this repo. Follow these instructions unless explicitly told
otherwise.

## Project Overview

**Getlnk** is an open-source link-in-bio platform built with:

- **Runtime:** Deno
- **Framework:** Fresh 2.x (file-based routing, islands architecture)
- **UI:** Preact + Tailwind CSS + DaisyUI
- **Backend:** Supabase (Auth + PostgreSQL)
- **Build:** Vite

## Core Principles

- Keep changes minimal and consistent with existing patterns.
- Prefer readability and maintainability over cleverness.
- Use TypeScript and existing utilities; avoid introducing new dependencies
  unless necessary.

## Development Commands

```bash
deno task dev      # Start development server (Vite)
deno task build    # Build for production
deno task check    # Run fmt --check, lint, and type-check
deno task start    # Serve production build
```

## UI Components

- Use the shared UI components in `components/ui/` everywhere possible.
- Available components: `Button`, `Input`, `Label`, `Select`, `Textarea`,
  `Checkbox`.
- If a needed component does not exist, add it to `components/ui/` and export it
  from both `components/ui/index.ts` and `components/index.ts`, then update the
  component docs (`docs/COMPONENTS.md`) if applicable.
- Keep styling consistent with the existing design system (Tailwind + DaisyUI
  patterns already in use).

## Data Access and API Rules

- **All database access must go through backend routes in `routes/api/`.**
- Client-side code (routes, islands) must call the API routes; do not query the
  database directly from the client.
- Server-side API routes can use shared helpers in `lib/` (for example
  `lib/supabase.ts` and validation utilities).

### API Response Patterns

Always return consistent JSON responses:

```typescript
// Success
return new Response(JSON.stringify({ data }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

// Error
return new Response(JSON.stringify({ error: "Message" }), {
  status: 400, // or appropriate status
  headers: { "Content-Type": "application/json" },
});
```

### Authentication in API Routes

Use `getSession()` from `lib/auth.ts` to verify authentication:

```typescript
import { getSession } from "../../../lib/auth.ts";
import { createSupabaseClient } from "../../../lib/supabase.ts";

const session = await getSession(ctx.req);
if (!session) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

const supabase = createSupabaseClient(session.accessToken);
```

### Supabase Client Usage

- `createSupabaseClient(accessToken)` — For authenticated user requests (uses
  RLS)
- `createAdminSupabaseClient()` — For admin operations (bypasses RLS, requires
  service role key)
- Never expose the service role key to client-side code

## Project Structure and Where to Add Code

### `routes/` — Page Routes and Middleware

- Add new pages as `routes/*.tsx`.
- Use `routes/_middleware.ts` for global auth checks.
- Admin-only pages live in `routes/admin/` with `routes/admin/_middleware.ts`.
- Dynamic routes use brackets: `@[username].tsx`, `[id].ts`
- The `_app.tsx` wraps all pages with common layout.

### `routes/api/` — Backend API Endpoints

- Add new backend logic here (database reads/writes, auth, etc).
- Keep endpoint concerns focused and return consistent JSON.
- Organized by feature:
  - `api/auth/` — Authentication (login, logout, password reset)
  - `api/links/` — Link CRUD operations
  - `api/profile/` — User profile management
  - `api/settings/` — User settings
  - `api/admin/` — Admin-only operations
  - `api/public-profile/` — Public (unauthenticated) profile endpoints

### `islands/` — Interactive UI Components

- Islands are client-side hydrated components (client-side behavior).
- Prefer small, focused islands that consume API endpoints.
- Use `fetch()` to call API routes; do not import database code.
- Examples: `LoginForm.tsx`, `LinksEditor.tsx`, `ProfileForm.tsx`

### `components/ui/` — Reusable UI Components

- Pure presentational components (Button, Input, etc).
- Do not reimplement shared UI in route or island files.
- Export from `index.ts` for easy imports.

### `components/` — Barrel Re-exports

- Keep lightweight; re-exports from `components/ui/`.

### `lib/` — Shared Utilities

- `auth.ts` — Session management, auth helpers (`getSession`, `getAuthUser`,
  `setAuthCookies`)
- `supabase.ts` — Supabase client creation and configuration
- `database.types.ts` — Auto-generated Supabase types
- `validators.ts` — Input validation (email, password)

### `assets/` and `static/`

- `assets/` — Stylesheets (`styles.css`)
- `static/` — Static files served directly (favicon, logo)

### Root Files

- `main.ts` / `client.ts` — App bootstrapping
- `utils.ts` — General utilities and Fresh `define` helper
- `deno.json` — Deno configuration, tasks, and imports
- `vite.config.ts` — Vite build configuration

## Authentication Flow

1. User authenticates via Supabase Auth
2. Tokens stored in HttpOnly cookies (`sb-access-token`, `sb-refresh-token`)
3. Middleware (`_middleware.ts`) checks auth and populates `ctx.state.authUser`
4. API routes verify session via `getSession(ctx.req)`

### Protected vs Public Routes

Public routes (no auth required):

- `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/auth/callback`
- `/@[username]` (public profile pages)
- `/api/auth/*`, `/api/public-profile/*`

All other routes require authentication.

## Validation

Use validators from `lib/validators.ts`:

- `validateEmail(email)` — Email format and common typo detection
- `validatePassword(password)` — Password strength validation
- `sanitizeInput(input)` — Basic input sanitization

## Behavior and Safety

- Preserve existing UX flows unless the task explicitly changes them.
- Prefer explicit error handling and user-friendly messages.
- Avoid direct DOM manipulation; use Preact patterns.
- Always validate user input on the server side.
- Use Row-Level Security (RLS) in Supabase for data access control.

## Code Style

- Use TypeScript strict mode.
- Follow Deno formatting rules (`deno fmt`).
- Use async/await over raw Promises.
- Destructure imports: `import { Button, Input } from "@/components/ui"`.
- Use the `@/` import alias for project imports.

## Testing

Before submitting changes:

1. Manually test affected functionality in the browser.
2. Verify API endpoints return expected responses.

## Environment Variables

Required environment variables (set in `.env`):

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)

## Documentation Files

- `README.md` — Project overview and quick start
- `docs/QUICK_START.md` — Development setup and next steps
- `docs/DATABASE_SETUP.md` — Database and auth configuration
- `docs/MVP_ROADMAP.md` — Feature roadmap and priorities
- `docs/COMPONENTS.md` — UI component documentation
- `docs/SECURITY_REFACTORING.md` — Security architecture
- `docs/LAUNCH_CHECKLIST.md` — Pre-launch validation
- `docs/FEATURE_RECOMMENDATIONS.md` — Post-launch feature priorities

### Documentation File Naming Rules

- **Do NOT create files with `*_REPORT.md` or `*_FIX.md` naming patterns.**
- These patterns are reserved and should not be used for documentation files.
- Use descriptive names that match existing documentation patterns (e.g.,
  `SETUP.md`, `GUIDE.md`, `ARCHITECTURE.md`).
