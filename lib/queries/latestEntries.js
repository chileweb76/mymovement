import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not set");

let cached = global._mongoClientPromise;
if (!cached) {
  const client = new MongoClient(uri);
  cached = client.connect();
  global._mongoClientPromise = cached;
}

async function getCollection() {
  const client = await cached;
  const dbName = process.env.MONGODB_DB || undefined;
  const db = dbName ? client.db(dbName) : client.db();
  // topics collection is where entries are stored by the save flow
  return db.collection("topics");
}

async function latestByTopic(topic) {
  const col = await getCollection();
  // topics use `date` as the timestamp field; map to `createdAt` for frontend
  const docs = await col.find({ topic }).sort({ date: -1 }).limit(1).toArray();
  const mapped = docs.map((doc) => {
    return {
      ...doc,
      id: doc._id ? String(doc._id) : undefined,
      createdAt: doc.date || doc.createdAt,
    };
  });
  return mapped; // keep array-of-one shape to match existing frontend usage
}

export async function foodLatest() {
  return latestByTopic("food");
}
export async function moodLatest() {
  return latestByTopic("mood");
}
export async function medsLatest() {
  return latestByTopic("meds");
}
export async function bowelLatest() {
  return latestByTopic("bowel");
}