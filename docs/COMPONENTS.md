# UI Components

Reusable UI components for the Fresh project with consistent styling and
TypeScript support.

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import Button from "@/components/Button.tsx";

// Primary button (default)
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- `loading`: boolean
- All standard button HTML attributes

---

### Input

A form input component with label, error, and helper text support.

```tsx
import Input from "@/components/Input.tsx";

// Basic input
<Input placeholder="Enter text..." />

// With label
<Input label="Email" type="email" required />

// With error
<Input label="Password" type="password" error="Password is required" />

// With helper text
<Input label="Username" helperText="Choose a unique username" />

// Variants
<Input variant="default" />  // Border with white background
<Input variant="filled" />   // Gray background (default)
<Input variant="outlined" /> // Thick border

// Sizes
<Input size="sm" />
<Input size="md" />
<Input size="lg" />

// Full width
<Input fullWidth />
```

**Props:**

- `label`: string
- `error`: string
- `helperText`: string
- `variant`: "default" | "filled" | "outlined"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- `required`: boolean
- All standard input HTML attributes

---

### Textarea

A textarea component with the same API as Input.

```tsx
import Textarea from "@/components/Textarea.tsx";

<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
  fullWidth
/>

<Textarea
  label="Comments"
  error="This field is required"
/>
```

**Props:**

- `label`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean
- `rows`: number (default: 4)
- `required`: boolean
- All standard textarea HTML attributes

---

### Label

A standalone label component.

```tsx
import Label from "@/components/Label.tsx";

<Label for="my-input">Field Name</Label>
<Label required>Required Field</Label>
```

**Props:**

- `required`: boolean
- All standard label HTML attributes

---

### Checkbox

A checkbox component with label support.

```tsx
import Checkbox from "@/components/Checkbox.tsx";

<Checkbox label="I agree to terms and conditions" />

<Checkbox
  label="Remember me"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

<Checkbox
  label="Subscribe"
  error="You must subscribe to continue"
/>
```

**Props:**

- `label`: string
- `error`: string
- All standard checkbox input HTML attributes (except `type`)

---

### Select

A styled select dropdown component.

```tsx
import Select from "@/components/Select.tsx";

<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
  ]}
/>

<Select
  label="Role"
  required
  options={[
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "superadmin", label: "Super Admin", disabled: true },
  ]}
  error="Please select a role"
/>
```

**Props:**

- `label`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean
- `options`: Array<{ value: string; label: string; disabled?: boolean }>
- `placeholder`: string
- `required`: boolean
- All standard select HTML attributes

---

## Usage Examples

### Login Form

```tsx
import { Button, Checkbox, Input } from "@/components/index.ts";

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
    placeholder="••••••••"
    fullWidth
    required
  />

  <Checkbox label="Remember me" />

  <Button fullWidth variant="primary">
    Sign In
  </Button>
</form>;
```

### Profile Form

```tsx
import { Button, Input, Select, Textarea } from "@/components/index.ts";

<form>
  <Input
    label="Full Name"
    placeholder="John Doe"
    fullWidth
  />

  <Input
    label="Email"
    type="email"
    placeholder="john@example.com"
    fullWidth
    disabled
  />

  <Select
    label="Role"
    options={[
      { value: "regular", label: "Regular User" },
      { value: "admin", label: "Administrator" },
    ]}
    fullWidth
  />

  <Textarea
    label="Bio"
    placeholder="Tell us about yourself..."
    rows={4}
    fullWidth
  />

  <div class="flex gap-3">
    <Button variant="secondary" fullWidth>
      Cancel
    </Button>
    <Button variant="primary" fullWidth>
      Save Changes
    </Button>
  </div>
</form>;
```

### Button Variants

```tsx
import { Button } from "@/components/index.ts";

<div class="flex gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Delete</Button>
</div>

<Button loading>Saving...</Button>
<Button disabled>Disabled</Button>
```

---

## Styling

All components use Tailwind CSS classes and follow your design system:

- **Primary color**: Gray 900 (black)
- **Border radius**: `rounded-xl` (extra large)
- **Focus rings**: 2px ring on focus
- **Transitions**: Smooth color transitions
- **Typography**: Sans-serif with uppercase labels

### Customization

You can override styles by passing `className`:

```tsx
<Button className="bg-blue-600 hover:bg-blue-700">
  Custom Color
</Button>

<Input className="border-blue-500" />
```

---

## Accessibility

All components include:

- Proper ARIA labels
- Focus states with visible rings
- Disabled states
- Required field indicators
- Error messages with proper semantics
- Unique IDs (auto-generated if not provided)

---

## TypeScript

All components are fully typed with TypeScript interfaces:

```tsx
interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  children: preact.ComponentChildren;
}
```

This provides:

- Full autocomplete in your IDE
- Type checking
- Better developer experience

---

## Best Practices

1. **Use fullWidth in forms** for consistent layout
2. **Always provide labels** for accessibility
3. **Use helper text** to guide users
4. **Show errors** with the `error` prop
5. **Mark required fields** with the `required` prop
6. **Choose appropriate variants** for visual hierarchy
7. **Use loading states** for async actions

---

## Future Enhancements

Potential additions:

- Radio button component
- Switch/toggle component
- File upload component
- Date picker
- Multi-select
- Autocomplete
- Badge/Tag component
- Card component
