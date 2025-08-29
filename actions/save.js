"use server";
<<<<<<< HEAD
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import Topic from "@/models/topic";
=======
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import { getTopicCollection, createTopic } from "@/models/topic";
import { findUserByEmail } from "@/models/user";
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b

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
<<<<<<< HEAD
  const ingredients = formData.get("ingredients");
  const form = formData.get("form");
  const id = formData.get("id");
  const date = new Date().toLocaleDateString();
=======
  console.log("[saveForm] incoming form entries:");
  for (const [k, v] of formData) console.log(k, v);
  console.log("[saveForm] incoming email:", email);

  const user = await findUserByEmail(email);
  console.log("[saveForm] findUserByEmail result:", user);
  if (!user) {
    return { results: { _error: "User not found for given email: " + email } };
  }

  const ingredients = formData.get("ingredients") || "";
  const form = formData.get("form");
  const id = formData.get("id");
  // Store current local date/time to avoid timezone issues in daily summary
  const date = new Date();
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b

  if (value.error) {
    return { results: { _error: "Title and Notes cannot be empty" } };
  } else {
    switch (form) {
      case "update":
        const objectId = new ObjectId(id);
<<<<<<< HEAD
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
=======
        
        // Security: Ensure user can only update their own entries
        const col = await getTopicCollection();
        const existingEntry = await col.findOne({ _id: objectId });
        if (!existingEntry) {
          return { results: { _error: "Entry not found" } };
        }
        
        // Check if the entry belongs to the current user
        if (!existingEntry.userId || existingEntry.userId.toString() !== user._id.toString()) {
          return { results: { _error: "You can only update your own entries" } };
        }
        
        const data = { title, notes, topic, ingredients, date, userId: user._id };
        // ensure connection and update the topics collection directly
        await clientPromise;
        await col.updateOne({ _id: objectId }, { $set: data });
        break;

      default:
        // ensure connection and save directly to topics collection via model
        await clientPromise;

        // normalize ingredients into an array (split by newline or comma)
        const ingredientsArray = ingredients
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

        // use model helper to create topic (handles ObjectId conversion)
        await createTopic({
          topic,
          title,
          notes,
          ingredients: ingredientsArray,
          date,
          userId: user._id,
        });

>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
        break;
    }

    redirect("/home");
  }
}
