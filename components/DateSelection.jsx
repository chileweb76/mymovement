"use client";

import * as actions from "@/actions/dailyDate";
import Image from "next/image";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import img from "@/public/img/search.svg";

export default function DateSelection() {
  const [formState, action] = useFormState(actions.dailyDate, {
    results: {},
  });

  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(new Date().toLocaleDateString());

  return (
    <form action={action} className="mb-4 flex h-6">
      <input name="searachParams" hidden={true} defaultValue={searchParams} />
      <DatePicker
        className="text-center w-28 rounded-l-md "
        selected={startDate}
        onChange={(date) => setStartDate(date.toLocaleDateString())}
        defaultValue={startDate}
        name="date"
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
    </form>
  );
}
