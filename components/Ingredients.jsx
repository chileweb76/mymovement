<<<<<<< HEAD
export default function Ingredients(props) {
  return (
    <>
      <h2 className="text-2xl mt-6">Ingredients</h2>
      <textarea
        name="ingredients"
        type="test"
        className="w-full h-60 text-black placeholder:pl-2"
        defaultValue={props.ingredients}
=======
import React from "react";

export default function Ingredients({ ingredients, value, onChange, className = "", ...rest }) {
  // Support both controlled (value + onChange) and uncontrolled (defaultValue)
  const isControlled = value !== undefined;

  const base = "block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <>
      <h2 className="text-lg font-semibold mt-3">Ingredients</h2>
      <textarea
        name="ingredients"
        className={`${base} ${className}`.trim()}
        {...(isControlled ? { value, onChange } : { defaultValue: ingredients })}
        aria-label="Ingredients"
        {...rest}
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
      />
    </>
  );
}
