export default function Button(props) {
  const {
    button, // legacy prop used as label in your codebase
    children,
    disabled = false,
    className = "",
    variant = "primary", // primary | secondary | ghost
    ...rest
  } = props;

  const base = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[var(--accent)] text-white hover:brightness-95",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    ghost: "bg-transparent text-[var(--accent)] hover:underline",
  };

  const variantClass = variants[variant] ?? variants.primary;

  return (
    <button
      type="submit"
      className={`${base} ${variantClass} ${className}`.trim()}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children ?? button}
    </button>
  );
}
