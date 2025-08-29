<<<<<<< HEAD
import { getServerSession } from "next-auth";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Topic from "@/models/topic";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function foodLatest() {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  await connectMongoDB();
  const user = await User.findOne({ email });
  const userId = user._id.toString();

  const entry = await Topic.find({
    $and: [{ userId: userId }, { topic: "food" }],
  })
    .sort({ createdAt: -1 })
    .limit(1);
  return entry;
}

export async function moodLatest() {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  await connectMongoDB();
  const user = await User.findOne({ email });
  const userId = user._id.toString();

  const entry2 = await Topic.find({
    $and: [{ userId: userId }, { topic: "mood" }],
  })
    .sort({ createdAt: -1 })
    .limit(1);

  return entry2;
}

export async function medsLatest() {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  await connectMongoDB();
  const user = await User.findOne({ email });
  const userId = user._id.toString();

  const entry3 = await Topic.find({
    $and: [{ userId: userId }, { topic: "meds" }],
  })
    .sort({ createdAt: -1 })
    .limit(1);

  return entry3;
}

export async function bowelLatest() {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  await connectMongoDB();
  const user = await User.findOne({ email });
  const userId = user._id.toString();

  const entry4 = await Topic.find({
    $and: [{ userId: userId }, { topic: "bowel" }],
  })
    .sort({ createdAt: -1 })
    .limit(1);

  return entry4;
}
=======
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

async function latestByTopic(topic, userEmail) {
  const col = await getCollection();
  
  // First get the user to find their userId
  const client = await cached;
  const dbName = process.env.MONGODB_DB || undefined;
  const db = dbName ? client.db(dbName) : client.db();
  const usersCol = db.collection("users");
  
  const user = await usersCol.findOne({ email: userEmail });
  if (!user) {
    return [];
  }
  
  // topics use `date` as the timestamp field; map to `createdAt` for frontend
  const docs = await col.find({ topic, userId: user._id }).sort({ date: -1 }).limit(1).toArray();
  const mapped = docs.map((doc) => {
    return {
      ...doc,
      id: doc._id ? String(doc._id) : undefined,
      createdAt: doc.date || doc.createdAt,
    };
  });
  return mapped; // keep array-of-one shape to match existing frontend usage
}

export async function foodLatest(userEmail) {
  return latestByTopic("food", userEmail);
}
export async function moodLatest(userEmail) {
  return latestByTopic("mood", userEmail);
}
export async function medsLatest(userEmail) {
  return latestByTopic("meds", userEmail);
}
export async function bowelLatest(userEmail) {
  return latestByTopic("bowel", userEmail);
}
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
