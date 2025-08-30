"use client";
import Image from "next/image";
import { useActionState } from "react";
import { useState, useEffect } from "react";

import * as actions from "@/actions/foodsearch";
import BarcodeScanner from "../BarcodeScanner";

import img from "@/public/img/search.svg";
import TopicForm from "../TopicForm";

export default function FoodSearch(props) {
  const [formState, action] = useActionState(actions.foodSearch, {
    results: {},
  });

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [upcValue, setUpcValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState("");

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

  const handleBarcodeScanned = (code) => {
    setUpcValue(code);
    setShowScanner(false);
    setScannerError("");
    // Auto-submit the form with the scanned UPC
    const formData = new FormData();
    formData.append('upc', code);
    action(formData);
  };

  const handleScannerError = (error) => {
    setScannerError(error);
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
    setScannerError("");
  };

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
      <h2 className="text-2xl font-semibold mb-3">Food Entry</h2>
      <p className="mb-3 text-gray-700">Search for foods by UPC using text input or camera scanning</p>

      <form action={action} className="mb-4">
        <div className="flex items-stretch max-w-xl">
          <input
            name="upc"
            type="text"
            value={upcValue}
            onChange={(e) => setUpcValue(e.target.value)}
            placeholder="UPC Search"
            aria-label="UPC Search"
            aria-describedby="UPC Search bar"
            className="flex-1 block w-full border border-gray-300 rounded-l-md px-3 py-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400"
            aria-label="Search"
          >
            <Image src={img} alt="search" width={20} height={20} />
          </button>
          <button
            type="button"
            onClick={toggleScanner}
            className="inline-flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
            aria-label="Scan Barcode"
          >
            📷
          </button>
        </div>

        {/* Scanner Error Display */}
        {scannerError && (
          <div className="mt-3 max-w-xl w-full bg-yellow-50 text-yellow-700 rounded-md p-2 text-sm">
            Scanner: {scannerError}
          </div>
        )}

        {formState.results._form ? (
          <div className="mt-3 max-w-xl w-full bg-red-50 text-red-700 rounded-md p-2 text-sm">
            {formState.results._form?.join(", ")}
          </div>
        ) : null}

        {formState.results._error ? (
          <div className="mt-3 max-w-xl w-full bg-red-50 text-red-700 rounded-md p-2 text-sm">
            {formState.results._error?.join(", ")}
          </div>
        ) : null}
      </form>

      {/* Barcode Scanner */}
      {showScanner && (
        <div className="mb-4 max-w-xl">
          <BarcodeScanner
            isActive={showScanner}
            onScan={handleBarcodeScanned}
            onError={handleScannerError}
          />
        </div>
      )}

      <div className="mt-3 max-w-xl">
        <p className="mb-1 text-sm text-gray-700">Search Results</p>
        <div className="bg-white text-gray-800 p-2 rounded-md">{title}</div>
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
