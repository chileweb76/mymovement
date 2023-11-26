"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";

import img from "@/public/img/search.svg";

export default function FoodForm() {
  const startingFoodData = {
    title: "",
    Notes: "",
  };

  const [foodData, setFoodData] = useState(startingFoodData);
  const [search, setSearch] = useState({});
  const [foodLabel, setFoodLabel] = useState("Search Results");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  const titleChange = (e) => {
    setTitle(e.target.value);
  };

  const ingredientChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    async function fetchAPI() {
      try {
        const response = await axios(
          `https://api.edamam.com/api/food-database/v2/parser?app_id=cd2130a5&app_key=ca65ba68ddafb742a94c488a4bfd3285&upc=${search}&nutrition-type=cooking`
        );
        setFoodLabel(response.data.hints[0].food.label);
        const notes = [
          response.data.hints[0].food.label,
          ":     ",
          response.data.hints[0].food.foodContentsLabel,
        ];
        setIngredients(notes.join(""));
        console.log(ingredients);
      } catch (err) {
        console.log(err);
        setFoodLabel(
          "Not Found (double check the upc code) or not in database"
        );
      }
    }
    fetchAPI();
  };

  return (
    <div className="mx-20 my-6 p-9 bg-food">
      <div className="grid md:grid-cols-2 gap-9 text-white">
        <div className="">
          <form onSubmit={handleSearch}>
            <div>
              <h2 className="text-2xl mb-6">Food Entry</h2>
              <p>Search for foods by UPC</p>
              <div className="grid grid-cols-3 mb-3">
                <input
                  id="upc"
                  name="upc"
                  type="text"
                  placeholder="UPC Search"
                  aria-label="UPC Search"
                  aria-describedby="UPC Search bar"
                  onChange={searchChange}
                  className="col-span-2"
                />
                <button
                  type="submit"
                  className="bg-slate-300 hover:bg-slate-400 w-12 flex justify-center"
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
            </div>
          </form>
          <div>
            <p>Search Results</p>
            <div>
              <p className="bg-white text-black">{foodLabel}</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl mb-6">Title</h2>
          <div>
            <input
              onChange={titleChange}
              aria-label="Title"
              aria-describedby="title input"
              value={title}
              className="w-full"
            />
            <h2 className="text-2xl">Notes</h2>
            <textarea
              onChange={ingredientChange}
              value={ingredients}
              placeholder="Ingredients List"
              className="w-full h-60 text-black"
            />
            <form>
              <button type="submit">Save</button>
            </form>
            <form>{<button type="submit">Delete</button>}</form>
          </div>
        </div>
      </div>
    </div>
  );
}
