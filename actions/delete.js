"use server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

import Topic from "@/models/topic";

export async function deleteEntry(formState, formData) {
  const id = formData.get("id");
  const objectId = new ObjectId(id);
  try {
    await connectMongoDB();
    await Topic.deleteOne(objectId);
    revalidatePath("/home");
  } catch (error) {
    console.log(error);
  }
}
