# AI Coding Rules

This file defines project-wide rules and placement guidance for AI agents
working in this repo. Follow these instructions unless explicitly told
otherwise.

## Core Principles

- Keep changes minimal and consistent with existing patterns.
- Prefer readability and maintainability over cleverness.
- Use TypeScript and existing utilities; avoid introducing new dependencies
  unless necessary.

## UI Components

- Use the shared UI components in `components/ui/` everywhere possible.
- If a needed component does not exist, add it to `components/ui/` and export it
  from both `components/ui/index.ts` and `components/index.ts`, then update the
  component docs (`components/ui/README.md` and `COMPONENTS.md`) if applicable.
- Keep styling consistent with the existing design system (Tailwind + DaisyUI
  patterns already in use).

## Data Access and API Rules

- All database access must go through backend routes in `routes/api/`.
- Client-side code (routes, islands) must call the API routes; do not query the
  database directly from the client.
- Server-side API routes can use shared helpers in `lib/` (for example
  `lib/supabase.ts` and validation utilities).

## Project Structure and Where to Add Code

- `routes/` — Page routes and route-level middleware.
  - Add new pages as `routes/*.tsx`.
  - Use `routes/_middleware.ts` for global auth checks.
  - Admin-only pages live in `routes/admin/` with `routes/admin/_middleware.ts`.
- `routes/api/` — Backend API endpoints.
  - Add new backend logic here (database reads/writes, auth, etc).
  - Keep endpoint concerns focused and return consistent JSON.
- `islands/` — Interactive UI components (client-side behavior).
  - Prefer small, focused islands that consume API endpoints.
- `components/ui/` — Reusable UI components (Button, Input, etc).
  - Do not reimplement shared UI in route or island files.
- `components/` — Barrel re-exports; keep lightweight.
- `lib/` — Shared utilities (auth helpers, database clients, types, validators).
- `assets/` and `static/` — Stylesheets and static assets (images, icons).
- `main.ts` / `client.ts` — App bootstrapping.
- `utils.ts` — General utilities.

## Behavior and Safety

- Preserve existing UX flows unless the task explicitly changes them.
- Prefer explicit error handling and user-friendly messages.
- Avoid direct DOM manipulation; use Preact patterns.
