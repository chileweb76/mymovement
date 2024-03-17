"use client";

import { useState } from "react";
import * as actions from "@/actions/dailyTopic";
import { useFormState } from "react-dom";

import { HiArrowCircleDown } from "react-icons/hi";
import { HiArrowCircleUp } from "react-icons/hi";
import { useSearchParams } from "next/navigation";

export default function DropDown() {
  const [formState, action] = useFormState(actions.dailyTopic, {
    results: {},
  });

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState("");

  return (
    <form action={action}>
      <input name="searchParams" hidden={true} defaultValue={searchParams} />
      <button
        name="topic"
        value={topic}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex bg-slate-300 hover:bg-slate-400 text-black rounded-full mt-4 py-2 px-5">
          {topic === "" ? <h3>Filter</h3> : <h3>{topic}</h3>}
          {!isOpen ? (
            <HiArrowCircleDown className="ml-2" size={25} />
          ) : (
            <HiArrowCircleUp className="ml-2" size={25} />
          )}
        </div>
        {isOpen && (
          <div>
            <ul>
              <li
                type="submit"
                onClick={() => setTopic("")}
                className="flex bg-slate-300 hover:bg-slate-400 cursor-pointer h-10 items-center justify-center rounded-full "
              >
                None
              </li>
              <li
                type="submit"
                onClick={() => setTopic("Food")}
                className="flex bg-food hover:bg-food_hover cursor-pointer h-10 items-center justify-center rounded-full"
              >
                Food
              </li>
              <li
                type="submit"
                onClick={() => setTopic("Mood")}
                className="flex bg-mood hover:bg-mood_hover cursor-pointer h-10 items-center justify-center rounded-full"
              >
                Mood
              </li>
              <li
                type="submit"
                onClick={() => setTopic("Meds")}
                className="flex bg-meds hover:bg-meds_hover cursor-pointer h-10 items-center justify-center rounded-full"
              >
                Meds
              </li>
              <li
                type="submit"
                onClick={() => setTopic("Bowel")}
                className="flex bg-bowel hover:bg-bowel_hover cursor-pointer h-10 items-center justify-center rounded-full"
              >
                Bowel
              </li>
            </ul>
          </div>
        )}
      </button>
    </form>
  );
}
