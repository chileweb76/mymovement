"use client";
import * as actions from "@/actions/delete";
import { useFormState } from "react-dom";

export default function DeleteButton(props) {
  const [formState, action] = useFormState(actions.deleteEntry, {
    results: {},
  });

  return (
    <form action={action}>
      <input name="id" type="text" hidden={true} defaultValue={props.id} />
      <button
        type="submit"
        className="bg-slate-300 hover:bg-red-400 text-black rounded-full ml-4 mt-4 py-2 px-5"
      >
        Delete
      </button>
    </form>
  );
}
