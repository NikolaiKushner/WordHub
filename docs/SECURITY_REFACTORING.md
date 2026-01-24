# Security Refactoring: Removed `dangerouslySetInnerHTML`

## Summary

Refactored all authentication pages to use **Fresh Islands** instead of
`dangerouslySetInnerHTML`, following Fresh best practices and improving
security.

## Why This Change?

1. **Security**: `dangerouslySetInnerHTML` can lead to XSS vulnerabilities
2. **Fresh Philosophy**: Islands are the proper way to handle client-side
   interactivity in Fresh
3. **Type Safety**: Islands provide full TypeScript support
4. **Better DX**: Easier to test, maintain, and debug

## Changes Made

### ✅ Created New Islands (Client-Side Components)

1. **`islands/LoginForm.tsx`**
   - Handles email/password login
   - Handles Google OAuth
   - Uses Preact signals for reactive state
   - Direct Supabase client usage on client-side

2. **`islands/RegisterForm.tsx`**
   - Handles email/password registration
   - Handles Google OAuth signup
   - Form validation and error handling

3. **`islands/AuthCallbackHandler.tsx`**
   - Processes OAuth callbacks
   - Exchanges tokens for session cookies
   - Handles redirects

4. **`islands/ProfileForm.tsx`**
   - Profile editing functionality
   - Real-time validation
   - Success/error messaging

5. **`islands/UserManagementTable.tsx`**
   - Admin user management
   - Role updates
   - Interactive table with Preact components

### ✅ Updated Routes (Server-Side Pages)

1. **`routes/login.tsx`** - Now uses `<LoginForm />` island
2. **`routes/register.tsx`** - Now uses `<RegisterForm />` island
3. **`routes/auth/callback.tsx`** - Now uses `<AuthCallbackHandler />` island
4. **`routes/profile.tsx`** - Now uses `<ProfileForm />` island
5. **`routes/admin/users.tsx`** - Now uses `<UserManagementTable />` island
6. **`routes/_app.tsx`** - Removed inline scripts, kept only CSS link

## Technical Details

### Before (Unsafe)

```tsx
<script
  type="module"
  dangerouslySetInnerHTML={{
    __html: `
      import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
      // ... inline JavaScript code
    `,
  }}
/>;
```

### After (Safe)

```tsx
import LoginForm from "../islands/LoginForm.tsx";

export default define.page(function Login(ctx) {
  const config = getSupabaseConfig();
  return (
    <LoginForm supabaseUrl={config.url} supabaseAnonKey={config.anonKey} />
  );
});
```

## Benefits

### 🔒 Security

- No inline script injection risks
- Proper escaping of user data
- CSP-friendly (Content Security Policy)

### 🎯 Type Safety

- Full TypeScript checking
- Compile-time error detection
- Better IDE autocomplete

### ⚡ Performance

- Code splitting (islands load only when needed)
- Better caching
- Smaller initial bundle

### 🧪 Testability

- Islands can be tested in isolation
- Easier to mock dependencies
- Better separation of concerns

### 🛠️ Maintainability

- Single source of truth for logic
- Easier refactoring
- Better code organization

## Fresh Islands Architecture

```
┌─────────────────────────────────────┐
│         routes/login.tsx            │  ← Server-rendered page
│  (Server-side, generates HTML)      │
└──────────────┬──────────────────────┘
               │ passes props
               ↓
┌─────────────────────────────────────┐
│      islands/LoginForm.tsx          │  ← Client-side interactive
│  (Hydrated on client, reactive)     │
└─────────────────────────────────────┘
```

## Migration Guide for Future Forms

If you need to add more interactive forms:

1. **Create an Island** in `islands/` directory
2. **Use Preact signals** for state management
3. **Pass config as props** from the route
4. **Handle events** with proper TypeScript typing

Example:

```tsx
// islands/MyForm.tsx
import { useSignal } from "@preact/signals";

interface MyFormProps {
  initialValue: string;
}

export default function MyForm({ initialValue }: MyFormProps) {
  const value = useSignal(initialValue);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // ... handle form submission
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Notes

- All Islands automatically support Partial Hydration
- Only interactive components are sent to the client
- Static content remains server-rendered HTML
- No JavaScript needed for non-interactive pages

## References

- [Fresh Islands Documentation](https://fresh.deno.dev/docs/concepts/islands)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
