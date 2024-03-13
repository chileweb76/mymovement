"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DateSelection() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="mb-4 ">
      <DatePicker
        className="text-center w-28 rounded-l-md "
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        name="date"
      />
    </div>
  );
}
