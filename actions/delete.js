"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail } from "@/models/user";

export async function deleteEntry(formState, formData) {
  const id = formData.get("id");
  if (!id) return { error: "No ID provided" };

  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return { error: "Not authenticated" };
  }

  // Get user details
  const user = await findUserByEmail(session.user.email);
  if (!user) {
    return { error: "User not found" };
  }

  // If `id` is a numeric timestamp (ms or s) create an ObjectId from that time,
  // otherwise treat `id` as an ObjectId hex string.
  let objectId;
  try {
    if (/^\d+$/.test(String(id))) {
      const num = Number(id);
      // ObjectId.createFromTime expects seconds since epoch.
      const seconds = num > 1_000_000_000_000 ? Math.floor(num / 1000) : num;
      objectId = ObjectId.createFromTime(seconds);
    } else {
      objectId = new ObjectId(id);
    }
  } catch (error) {
    return { error: "Invalid ID format" };
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || undefined);
    const col = db.collection("topics");
    
    // Security: only allow user to delete their own records
    const result = await col.deleteOne({ _id: objectId, userId: user._id });
    
    if (result.deletedCount === 0) {
      return { error: "Record not found or you don't have permission to delete it" };
    }
    
    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error("[deleteEntry] error:", error);
    return { error: "Failed to delete entry" };
  }
}
