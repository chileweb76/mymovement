"use client";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";

import * as actions from "@/actions/foodsearch";

import img from "@/public/img/search.svg";
import TopicForm from "../TopicForm";

export default function FoodSearch(props) {
  const [formState, action] = useFormState(actions.foodSearch, {
    results: {},
  });

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState("");

  useEffect(() => {
    setTitle(formState.results.label);
    if (
      formState.results.label !== undefined &&
      formState.results.foodContentsLabel !== undefined
    ) {
      setNotes(formState.results.label);
      setIngredients(formState.results.foodContentsLabel);
    } else {
      setNotes(props.notes);
      setIngredients(props.ingredients);
    }
  }, [
    formState.results.label,
    formState.results.foodContentsLabel,
    props.notes,
    props.ingredients,
  ]);

  return (
    <>
      <h2 className="text-3xl mb-6">Food Entry</h2>
      <p>Search for foods by UPC</p>
      <form action={action}>
        <div className="flex mb-3 ">
          <input
            name="upc"
            type="text"
            placeholder="UPC Search"
            aria-label="UPC Search"
            aria-describedby="UPC Search bar"
            className="rounded-l-md placeholder:pl-2 text-black"
          />
          <button
            type="submit"
            className="bg-slate-300 hover:bg-slate-400 w-12 flex justify-center rounded-r-md"
          >
            <Image
              src={img}
              alt="search button"
              width={20}
              height={20}
              className="h-full"
            />
          </button>
        </div>
        {formState.results._form ? (
          <div className="rounded p-2 bg-red-200 border border-red-400 w-1/4 text-black">
            {" "}
            {formState.results._form?.join(", ")}
          </div>
        ) : null}
        {formState.results._error ? (
          <div className="rounded p-2 bg-red-200 border border-red-400 w-1/2 text-black">
            {" "}
            {formState.results._error?.join(", ")}
          </div>
        ) : null}
      </form>
      <div>
        <p>Search Results</p>
        <p className="bg-white text-black pl-2 w-3/4 h-6">{title}</p>
      </div>
      <TopicForm
        id={props.id}
        form={props.form}
        title={props.title}
        notes={notes}
        topic={props.topic}
        ingredients={ingredients}
        email={props.email}
      />
    </>
  );
}
