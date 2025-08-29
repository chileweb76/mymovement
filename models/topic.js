import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb.js";

export function getTopicCollection() {
  return clientPromise.then((client) => client.db().collection("topics"));
}

/**
 * topicData: { topic, title, notes?, ingredients?: string[], date: Date | string, userId: ObjectId|string }
 */
export async function createTopic(topicData) {
  const col = await getTopicCollection();
  const doc = {
    topic: topicData.topic,
    title: topicData.title,
    notes: topicData.notes || "",
    ingredients: topicData.ingredients || [],
    date: topicData.date instanceof Date ? topicData.date : new Date(topicData.date),
    userId: typeof topicData.userId === "string" ? new ObjectId(topicData.userId) : topicData.userId,
  };
  const res = await col.insertOne(doc);
  return res.insertedId;
}

export async function findTopicsByUserId(userId) {
  const col = await getTopicCollection();
  const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
  return col.find({ userId: _id }).toArray();
}

/**
 * Migration helper: Find topics that don't have a userId field
 */
export async function findTopicsWithoutUserId() {
  const col = await getTopicCollection();
  return col.find({ userId: { $exists: false } }).toArray();
}

/**
 * Migration helper: Add userId to existing topics based on email
 * This should only be run once during migration
 */
export async function migrateTopicsAddUserId() {
  const col = await getTopicCollection();
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || undefined);
  const usersCol = db.collection("users");
  
  // Find all topics without userId
  const topicsWithoutUserId = await col.find({ userId: { $exists: false } }).toArray();
  
  console.log(`Found ${topicsWithoutUserId.length} topics without userId`);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  for (const topic of topicsWithoutUserId) {
    if (topic.email) {
      // Find user by email
      const user = await usersCol.findOne({ email: topic.email });
      if (user) {
        // Update topic with userId
        await col.updateOne(
          { _id: topic._id },
          { 
            $set: { userId: user._id },
            $unset: { email: "" }  // Remove email field since we now have userId
          }
        );
        migratedCount++;
      } else {
        console.warn(`User not found for email: ${topic.email}`);
        skippedCount++;
      }
    } else {
      console.warn(`Topic has no email field: ${topic._id}`);
      skippedCount++;
    }
  }
  
  console.log(`Migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
  return { migratedCount, skippedCount };
}