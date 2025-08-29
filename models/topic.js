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