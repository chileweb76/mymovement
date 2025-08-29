"use client";
import * as actions from "@/actions/delete";
import { useActionState } from "react";

export default function Delete(props) {
  const [formState, action] = useActionState(actions.deleteEntry, {
    results: {},
  });

  return (
    <form action={action}>
      <input name="id" type="text" hidden defaultValue={props.id} />
      <button
        type="submit"
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition
          bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ""}`}
        disabled={formState?.pending}
        aria-busy={formState?.pending ? "true" : "false"}
      >
        {formState?.pending ? (
          <>
            <svg
              className="w-3 h-3 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Deleting...
          </>
        ) : (
          "Delete"
        )}
      </button>
    </form>
  );
}
