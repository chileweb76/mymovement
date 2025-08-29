"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
export function TimeZone(entry) {
=======
export function TimeZone({ entry }) {
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
  const router = useRouter();
  const [createdAtDate, setCreatedAtDate] = useState("");
  const [createdAtTime, setCreatedAtTime] = useState("");

  useMemo(() => {
<<<<<<< HEAD
    const date = new Date(entry.entry);
=======
    const date = new Date(entry);
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
    setCreatedAtDate(
      date.toLocaleString(router.locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
    setCreatedAtTime(
      date.toLocaleString(router.locale, {
        hour: "numeric",
        minute: "numeric",
      })
    );
  }, [router.locale, entry]);

  return (
    <>
      <p>{createdAtDate}</p>
      <p className="ml-4">{createdAtTime}</p>
    </>
  );
}
