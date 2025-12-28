import type { JSX } from "preact";

type InputElement = JSX.IntrinsicElements["input"];

interface CheckboxProps extends Omit<InputElement, "type"> {
  label?: string;
  error?: string;
}

export default function Checkbox({
  label,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  // Generate a unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = "h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded transition-colors";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  const combinedClassName = `${baseStyles} ${errorStyles} ${className}`.trim();

  return (
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          {...props}
          type="checkbox"
          id={checkboxId}
          className={combinedClassName}
        />
      </div>
      {label && (
        <div class="ml-3">
          <label for={checkboxId} class="text-sm text-gray-700">
            {label}
          </label>
          {error && (
            <p class="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
