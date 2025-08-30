"use server";

import { redirect } from "next/navigation";

export async function dailyTopic(formState, formData) {
  const searchParams = formData.get("searchParams");
  const topic = formData.get("topic");

  if (searchParams === null) {
    redirect(`/daily_summary?topic=${topic}`);
  } else {
    redirect(`/daily_summary?${searchParams}?topic=${topic}`);
  }
}
