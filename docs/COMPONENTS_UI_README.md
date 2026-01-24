# UI Components

Reusable UI component library for the Fresh project.

## Location

All UI components are located in `components/ui/`

## Components

- **Button** - Versatile button with variants (primary, secondary, outline,
  ghost, danger)
- **Input** - Form input with label, error states, and variants
- **Textarea** - Multi-line text input
- **Select** - Dropdown select with options
- **Checkbox** - Checkbox with label support
- **Label** - Standalone label component

## Usage

### Import from barrel export:

```tsx
import { Button, Checkbox, Input } from "@/components/ui/index.ts";
```

### Or import individually:

```tsx
import Button from "@/components/ui/Button.tsx";
import Input from "@/components/ui/Input.tsx";
```

### Or from root components export:

```tsx
import { Button, Input } from "@/components/index.ts";
```

## Examples

### Login Form

```tsx
import { Button, Checkbox, Input } from "@/components/ui/index.ts";

<form>
  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    fullWidth
    required
  />

  <Input
    label="Password"
    type="password"
    fullWidth
    required
  />

  <Checkbox label="Remember me" />

  <Button variant="primary" fullWidth>
    Sign In
  </Button>
</form>;
```

### Profile Form

```tsx
import { Button, Input } from "@/components/ui/index.ts";

<form>
  <Input
    label="Email"
    value={email}
    disabled
    helperText="Email cannot be changed"
    fullWidth
  />

  <Input
    label="Name"
    value={name}
    onChange={handleChange}
    fullWidth
  />

  <div class="flex gap-4">
    <Button variant="primary" fullWidth>Save</Button>
    <Button variant="secondary" fullWidth>Cancel</Button>
  </div>
</form>;
```

## Design System

All components follow a consistent design:

- **Colors**: Gray-900 (primary), with color variants
- **Border Radius**: `rounded-xl` (0.75rem)
- **Spacing**: Consistent padding and margins
- **Typography**: Sans-serif with uppercase labels
- **States**: Hover, focus, disabled, loading
- **Transitions**: Smooth color/state changes

## Component Props

### Button

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- `loading`: boolean (shows spinner)
- All native button props

### Input

- `label`: string
- `error`: string (shows error message)
- `helperText`: string (shows help text)
- `variant`: "default" | "filled" | "outlined"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- All native input props

### Select

- `label`: string
- `error`: string
- `helperText`: string
- `options`: Array<{ value, label, disabled? }>
- `placeholder`: string
- `fullWidth`: boolean
- All native select props

### Checkbox

- `label`: string
- `error`: string
- All native checkbox props (except `type`)

### Textarea

- Same as Input props
- `rows`: number (default: 4)
- All native textarea props

### Label

- `required`: boolean (shows red asterisk)
- All native label props

## TypeScript

All components are fully typed using modern Preact types:

```tsx
type ButtonElement = JSX.IntrinsicElements["button"];
interface ButtonProps extends ButtonElement {
  variant?: "primary" | "secondary" | ...;
  // ... custom props
}
```

This provides:

- Full autocomplete
- Type safety
- Better DX

## Accessibility

- Proper ARIA labels
- Focus management
- Keyboard navigation
- Screen reader support
- Semantic HTML

## File Structure

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Label.tsx
│   ├── index.ts (barrel export)
│   └── README.md (this file)
└── index.ts (re-exports from ui/)
```

## Adding New Components

1. Create component in `components/ui/YourComponent.tsx`
2. Export from `components/ui/index.ts`
3. Export from `components/index.ts`
4. Document in this README

## Styling

Components use Tailwind CSS utility classes. To customize:

```tsx
<Button className="your-custom-classes">
  Custom Button
</Button>;
```

## Best Practices

1. ✅ Use `fullWidth` for form layouts
2. ✅ Always provide labels for inputs
3. ✅ Show error messages with the `error` prop
4. ✅ Use `helperText` to guide users
5. ✅ Mark required fields with `required`
6. ✅ Choose appropriate button variants
7. ✅ Use loading states for async actions
8. ✅ Import from barrel export for cleaner code

## Used In

These components are used throughout the app:

- ✅ LoginForm island
- ✅ RegisterForm island
- ✅ ProfileForm island
- ✅ UserManagementTable island
- Can be used in any route or island

## Documentation

For full component documentation, see:

- [COMPONENTS.md](./COMPONENTS.md) - Complete API reference
