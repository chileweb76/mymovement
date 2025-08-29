"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/models/user";

export async function deleteEntry(formState, formData) {
  const id = formData.get("id");
  if (!id) return;

  // Get current user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Get user from database
  const user = await findUserByEmail(session.user.email);
  if (!user) {
    throw new Error("User not found");
  }

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
    
    // Only delete if the entry belongs to the current user
    const result = await col.deleteOne({ _id: objectId, userId: user._id });
    
    if (result.deletedCount === 0) {
      console.warn("[deleteEntry] No entry found or user unauthorized to delete entry with id:", id);
    }
    
    revalidatePath("/home");
  } catch (error) {
    console.error("[deleteEntry] error:", error);
  }
}
