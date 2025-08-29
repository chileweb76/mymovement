"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function deleteEntry(formState, formData) {
  const id = formData.get("id");
  if (!id) return;

  // If `id` is a numeric timestamp (ms or s) create an ObjectId from that time,
  // otherwise treat `id` as an ObjectId hex string.
  let objectId;
  if (/^\d+$/.test(String(id))) {
    const num = Number(id);
    // ObjectId.createFromTime expects seconds since epoch.
    const seconds = num > 1_000_000_000_000 ? Math.floor(num / 1000) : num;
    objectId = ObjectId.createFromTime(seconds);
  } else {
    objectId = new ObjectId(id);
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection("topics"); // adjust collection name if needed
    await col.deleteOne({ _id: objectId });
    revalidatePath("/home");
  } catch (error) {
    console.error("[deleteEntry] error:", error);
  }
}
