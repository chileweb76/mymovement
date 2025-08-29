import React from "react";

export default function FormTextarea({
  name,
  label,
  value,
  defaultValue,
  onChange,
  className = "",
  style = {},
  ...rest
}) {
  const isControlled = value !== undefined;
  const id = name ? `${name}-textarea` : undefined;

  return (
    <>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white mb-2"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        name={name}
        className={`block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] mb-3 ${className}`}
        {...(isControlled ? { value, onChange } : { defaultValue })}
        style={style}
        {...rest}
      />
    </>
  );
}
