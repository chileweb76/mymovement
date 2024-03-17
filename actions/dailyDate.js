"use server";

import { redirect } from "next/navigation";

export async function dailyDate(formState, formData) {
  const searchParams = formData.get("searchParams");
  const date = formData.get("date");

  if (searchParams === null) {
    redirect(`/daily_summary?date=${date}`);
  } else {
    redirect(`/daily_summary?${searchParams}?date=${date}`);
  }
}
