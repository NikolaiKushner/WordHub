# Security Architecture

## Overview

All authentication pages use **Fresh Islands** instead of inline scripts,
eliminating XSS risks from `dangerouslySetInnerHTML`.

## Islands (Client-Side Components)

| Island                    | Purpose                |
| ------------------------- | ---------------------- |
| `LoginForm.tsx`           | Email/password + OAuth |
| `RegisterForm.tsx`        | Registration + OAuth   |
| `AuthCallbackHandler.tsx` | OAuth callback         |
| `ProfileForm.tsx`         | Profile editing        |
| `UserManagementTable.tsx` | Admin user management  |

## Auth Flow

```
Route (server-rendered) --> passes config props --> Island (client-side, hydrated)
```

Routes render static HTML and pass Supabase config to islands as props. Islands
handle all interactive behavior using Preact signals.

## Security Benefits

- No inline script injection risks (CSP-friendly)
- Full TypeScript type checking
- Islands load only when needed (code splitting)
- Proper escaping of all user data

## Adding New Forms

1. Create an island in `islands/`
2. Use `useSignal` from `@preact/signals` for state
3. Pass config as props from the route
4. Use `fetch()` to call API routes
