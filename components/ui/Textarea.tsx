import type { JSX } from "preact";

type TextareaElement = JSX.IntrinsicElements["textarea"];

interface TextareaProps extends TextareaElement {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Textarea({
  label,
  error,
  helperText,
  fullWidth = false,
  rows = 4,
  className = "",
  id,
  required,
  ...props
}: TextareaProps) {
  // Generate a unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // Base styles
  const baseStyles = "transition-all duration-200 focus:outline-none resize-none";

  // Variant styles
  const variantStyles = "border-0 bg-gray-50 focus:ring-2 focus:ring-gray-900 px-4 py-3 rounded-xl";

  // Error styles
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500"
    : "";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${variantStyles} ${errorStyles} ${widthStyles} ${className}`.trim();

  return (
    <div class={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          for={textareaId}
          class="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
        >
          {label}
          {required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        {...props}
        id={textareaId}
        rows={rows}
        required={required}
        className={combinedClassName}
      />

      {error && (
        <p class="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p class="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
