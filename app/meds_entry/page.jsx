"use client";

import NewEntry from "@/components/NewEntry";
import TopicForm from "@/components/TopicForm";
import { useEffect, useState } from "react";

export default function MedsEntry() {
  const [email, setEmail] = useState();

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setEmail(data.email));
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <NewEntry />
      <div className=" sm:mx-8 md:mx-20 my-6 p-9 bg-meds">
        <div className="text-white">
          <TopicForm email={email} topic="meds" />
        </div>
      </div>
    </main>
  );
}
