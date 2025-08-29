"use client";
import * as actions from "@/actions/save";
import { useActionState } from "react";

import Button from "@/components/button/button";
import Ingredients from "@/components/Ingredients";
import FormTextarea from "@/components/FormTextarea";
import { useEffect, useState } from "react";

export default function TopicForm(props) {
  const [formState, action] = useActionState(actions.saveForm, {
    results: {},
  });

  const [show, setShow] = useState(false);

  // Controlled form state
  const [title, setTitle] = useState(props.title || "");
  const [notes, setNotes] = useState(props.notes || "");
  const [ingredients, setIngredients] = useState(props.ingredients || "");
  const [titleTouched, setTitleTouched] = useState(false);

  useEffect(() => {
    if (props.topic === "food") {
      setShow(true);
    }
  }, [props.topic]);

  useEffect(() => {
    // keep controlled state in sync if props change (edit existing)
    setTitle(props.title || "");
    setNotes(props.notes || "");
    setIngredients(props.ingredients || "");
  }, [props.title, props.notes, props.ingredients]);

  const isValid = title.trim().length > 0;

  return (
    <>
      <h2 className="text-lg font-semibold mt-4 text-white">Title</h2>
      <form action={action} className="space-y-4">
        <div>
          <input
            name="title"
            type="text"
            className={`block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${titleTouched && !isValid ? "ring-2 ring-red-500" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTitleTouched(true)}
            aria-invalid={titleTouched && !isValid}
            aria-describedby="title-feedback"
          />
          {titleTouched && !isValid ? (
            <div id="title-feedback" className="text-sm text-red-600 mt-2">
              Title is required.
            </div>
          ) : null}
        </div>

        <FormTextarea
          name="notes"
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ height: 240 }}
        />

        {show ? (
          <Ingredients
            ingredients={props.ingredients}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        ) : null}

        <input name="topic" type="text" hidden defaultValue={props.topic} />
        <input name="email" type="text" hidden defaultValue={props.email} />
        <input name="form" type="text" hidden defaultValue={props.form} />

        {/* Mirror controlled values into hidden inputs for server action */}
        <input name="notes" type="hidden" value={notes} />
        <input name="ingredients" type="hidden" value={ingredients} />
        <input name="id" type="hidden" value={props.id || ""} />

        <div className="flex items-center justify-end gap-3">
          {formState.results._error ? (
            <div className="text-sm text-red-600 mr-3">
              {Array.isArray(formState.results._error)
                ? formState.results._error.join(", ")
                : formState.results._error}
            </div>
          ) : null}

          <Button
            button="Save"
            disabled={!isValid || formState.pending}
            className="bg-gray-600 text-white"
          />
        </div>
      </form>
    </>
  );
}
