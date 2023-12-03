"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function TimeZone(entry) {
  const router = useRouter();
  const [createdAtDate, setCreatedAtDate] = useState("");
  const [createdAtTime, setCreatedAtTime] = useState("");

  useMemo(() => {
    const date = new Date(entry.entry);
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
      <p className="pl-4 pt-4">{createdAtDate}</p>
      <p className="pl-4">{createdAtTime}</p>
    </>
  );
}
