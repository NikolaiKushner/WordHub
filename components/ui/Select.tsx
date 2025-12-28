import type { JSX } from "preact";

type SelectElement = JSX.IntrinsicElements["select"];

interface SelectProps extends SelectElement {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export default function Select({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  placeholder,
  className = "",
  id,
  required,
  ...props
}: SelectProps) {
  // Generate a unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Base styles
  const baseStyles = "transition-all duration-200 focus:outline-none appearance-none bg-no-repeat";

  // Variant styles (matching Input filled style)
  const variantStyles = "border-0 bg-gray-50 focus:ring-2 focus:ring-gray-900 px-4 py-3 rounded-xl pr-10";

  // Error styles
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500"
    : "";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  // Arrow icon background
  const arrowBg = "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center]";

  const combinedClassName = `${baseStyles} ${variantStyles} ${errorStyles} ${widthStyles} ${arrowBg} ${className}`.trim();

  return (
    <div class={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          for={selectId}
          class="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
        >
          {label}
          {required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        {...props}
        id={selectId}
        required={required}
        className={combinedClassName}
      >
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p class="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p class="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
