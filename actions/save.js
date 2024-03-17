"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import Topic from "@/models/topic";

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
  const form = formData.get("form");
  const id = formData.get("id");
  const date = new Date().toLocaleDateString();

  if (value.error) {
    return { results: { _error: "Title and Notes cannot be empty" } };
  } else {
    switch (form) {
      case "update":
        const objectId = new ObjectId(id);
        const data = { title, notes, topic, email, ingredients, date };
        await connectMongoDB();
        await Topic.findByIdAndUpdate({ _id: objectId }, data);
        break;

      default:
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
              date,
            }),
          });
        } catch (error) {
          console.log(error);
        }
        break;
    }

    redirect("/home");
  }
}
