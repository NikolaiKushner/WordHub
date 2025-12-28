import type { JSX } from "preact";

type InputElement = JSX.IntrinsicElements["input"];

interface InputProps extends Omit<InputElement, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  size = "md",
  variant = "filled",
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Base styles
  const baseStyles = "transition-all duration-200 focus:outline-none";

  // Variant styles
  const variantStyles = {
    default: "border border-gray-300 bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent",
    filled: "border-0 bg-gray-50 focus:ring-2 focus:ring-gray-900",
    outlined: "border-2 border-gray-300 bg-transparent focus:border-gray-900",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-xl",
    lg: "px-5 py-4 text-lg rounded-xl",
  };

  // Error styles
  const errorStyles = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${errorStyles} ${widthStyles} ${className}`.trim();

  return (
    <div class={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          for={inputId}
          class="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide"
        >
          {label}
          {required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        {...props}
        id={inputId}
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
