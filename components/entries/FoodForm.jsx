"use client";
import Image from "next/image";
<<<<<<< HEAD
import { useFormState } from "react-dom";
=======
import { useActionState } from "react";
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
import { useState, useEffect } from "react";

import * as actions from "@/actions/foodsearch";

import img from "@/public/img/search.svg";
import TopicForm from "../TopicForm";

export default function FoodSearch(props) {
<<<<<<< HEAD
  const [formState, action] = useFormState(actions.foodSearch, {
=======
  const [formState, action] = useActionState(actions.foodSearch, {
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
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
<<<<<<< HEAD
      <h2 className="text-3xl mb-6">Food Entry</h2>
      <p>Search for foods by UPC</p>
      <form action={action}>
        <div className="flex mb-3 ">
=======
      <h2 className="text-2xl font-semibold mb-3">Food Entry</h2>
      <p className="mb-3 text-gray-700">Search for foods by UPC</p>

      <form action={action} className="mb-4">
        <div className="flex items-stretch max-w-xl">
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
          <input
            name="upc"
            type="text"
            placeholder="UPC Search"
            aria-label="UPC Search"
            aria-describedby="UPC Search bar"
<<<<<<< HEAD
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
=======
            className="flex-1 block w-full border border-gray-300 rounded-l-md px-3 py-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-400"
            aria-label="Search"
          >
            <Image src={img} alt="search" width={20} height={20} />
          </button>
        </div>

        {formState.results._form ? (
          <div className="mt-3 max-w-xl w-full bg-red-50 text-red-700 rounded-md p-2 text-sm">
            {formState.results._form?.join(", ")}
          </div>
        ) : null}

        {formState.results._error ? (
          <div className="mt-3 max-w-xl w-full bg-red-50 text-red-700 rounded-md p-2 text-sm">
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
            {formState.results._error?.join(", ")}
          </div>
        ) : null}
      </form>
<<<<<<< HEAD
      <div>
        <p>Search Results</p>
        <p className="bg-white text-black pl-2 w-3/4 h-6">{title}</p>
      </div>
=======

      <div className="mt-3 max-w-xl">
        <p className="mb-1 text-sm text-gray-700">Search Results</p>
        <div className="bg-white text-gray-800 p-2 rounded-md">{title}</div>
      </div>

>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
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
