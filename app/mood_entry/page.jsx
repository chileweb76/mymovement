"use client";

import NewEntry from "@/components/NewEntry";
import TopicForm from "@/components/TopicForm";
import { useEffect, useState } from "react";

export default function MoodEntry() {
  const [email, setEmail] = useState();

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setEmail(data.email));
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <NewEntry />
      <div className=" sm:mx-8 md:mx-20 my-6 p-9 bg-mood">
        <div className="text-white">
          <TopicForm email={email} topic="mood" />
        </div>
      </div>
    </main>
  );
}
