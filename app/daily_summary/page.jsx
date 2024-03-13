"use client";

import Image from "next/image";
import * as actions from "@/actions/dailyData";
import { useFormState } from "react-dom";
import DateSelection from "@/components/DatePicker";
import DropDown from "@/components/DropDown";
import Newentry from "@/components/NewEntry";
import img from "@/public/img/search.svg";

export default function DailySummary() {
  const [formState, action] = useFormState(actions.dailyData, {
    results: {},
  });
  return (
    <main className="flex flex-col min-h-screen">
      <Newentry />
      <h1 className="text-3xl font-bold text-center m-4">Daily Summary</h1>
      <form action={action} className="ml-auto mr-16 ">
        <div className="flex h-6">
          <DateSelection />
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
        <DropDown />
      </form>
    </main>
  );
}
