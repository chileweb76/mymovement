"use client";
import * as actions from "@/actions/save";
import { useFormState } from "react-dom";

import SaveButton from "@/components/buttons/Save";
import Ingredients from "./Ingredients";
import { useEffect, useState } from "react";

export default function TopicForm(props) {
  const [formState, action] = useFormState(actions.saveForm, {
    results: {},
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (props.topic === "food") {
      setShow(true);
    }
  }, [props.topic]);

  return (
    <>
      <h2 className="text-2xl mt-6">Title</h2>
      <form action={action}>
        <input name="title" type="text" className="w-full text-black" />

        <h2 className="text-2xl mt-6">Notes</h2>
        <textarea
          name="notes"
          type="text"
          className="w-full h-60 text-black placeholder:pl-2"
          defaultValue={props.notes}
        />
        {formState.results._form ? (
          <div className="rounded p-2 bg-red-200 border border-red-400 w-1/2 text-black">
            {" "}
            {formState.results._form?.join(", ")}
          </div>
        ) : null}
        {show ? <Ingredients ingredients={props.ingredients} /> : null}
        <input
          name="topic"
          type="text"
          hidden={true}
          defaultValue={props.topic}
        />
        <input
          name="email"
          type="text"
          hidden={true}
          defaultValue={props.email}
        />
        <div className="flex justify-end">
          <SaveButton button="Save" />
        </div>
      </form>
    </>
  );
}
