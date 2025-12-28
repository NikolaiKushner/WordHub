import type { JSX } from "preact";

type LabelElement = JSX.IntrinsicElements["label"];

interface LabelProps extends LabelElement {
  required?: boolean;
  children: preact.ComponentChildren;
}

export default function Label({
  required = false,
  className = "",
  children,
  ...props
}: LabelProps) {
  const baseStyles = "block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <label {...props} className={combinedClassName}>
      {children}
      {required && <span class="text-red-500 ml-1">*</span>}
    </label>
  );
}
