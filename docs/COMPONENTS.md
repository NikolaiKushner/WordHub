# UI Components

Reusable UI component library located in `components/ui/`.

## Available Components

| Component    | Props                                              |
| ------------ | -------------------------------------------------- |
| **Button**   | `variant`, `size`, `fullWidth`, `loading` + native |
| **Input**    | `label`, `error`, `helperText`, `variant`, `size`  |
| **Textarea** | Same as Input + `rows`                             |
| **Select**   | `label`, `error`, `options[]`, `placeholder`       |
| **Checkbox** | `label`, `error` + native checkbox props           |
| **Label**    | `required` + native label props                    |

## Usage

```tsx
// Barrel import
import { Button, Checkbox, Input } from "@/components/ui/index.ts";

// Individual import
import Button from "@/components/ui/Button.tsx";
```

## Variants

**Button:** `primary` | `secondary` | `outline` | `ghost` | `danger`

**Input:** `default` | `filled` | `outlined`

**Sizes (Button/Input):** `sm` | `md` | `lg`

## Design System

- **Colors:** Gray-900 primary, with color variants
- **Border Radius:** `rounded-xl`
- **Focus:** 2px ring on focus
- **Typography:** Sans-serif with uppercase labels
- **Transitions:** Smooth color/state changes

## Adding New Components

1. Create in `components/ui/YourComponent.tsx`
2. Export from `components/ui/index.ts`
3. Export from `components/index.ts`

## Used In

LoginForm, RegisterForm, ProfileForm, UserManagementTable, LinksEditor
