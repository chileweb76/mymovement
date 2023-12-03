"use client";

import NewEntry from "@/components/NewEntry";
import FoodForm from "@/components/entries/FoodForm";
import { useEffect, useState } from "react";

export default function FoodEntry() {
  const [email, setEmail] = useState();

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setEmail(data.email));
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <NewEntry />
      <div className=" sm:mx-8 md:mx-20 my-6 p-9 bg-food">
        <div className="text-white">
          <FoodForm email={email} />
        </div>
      </div>
    </main>
  );
}
