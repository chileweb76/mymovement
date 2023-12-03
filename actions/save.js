"use server";

import Joi from "joi";
import { redirect } from "next/navigation";

const saveFormSchema = Joi.object({
  title: Joi.string(),
  notes: Joi.string(),
});

export async function saveForm(formState, formData) {
  const value = saveFormSchema.validate({
    title: formData.get("title"),
    notes: formData.get("notes"),
  });

  const title = formData.get("title");
  const notes = formData.get("notes");
  const topic = formData.get("topic");
  const email = formData.get("email");
  const ingredients = formData.get("ingredients");

  if (value.error) {
    return { results: { _form: [value.error.message] } };
  } else {
    try {
      await fetch(process.env.WEB_URL_TOPIC, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          notes,
          topic,
          email,
          ingredients,
        }),
      });
    } catch (error) {
      console.log(error);
    }
    redirect("/home");
  }
}
