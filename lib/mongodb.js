import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI in environment. See .env");
}

// Use a global to preserve the client across hot reloads in dev
let client;
let clientPromise;

if (globalThis._mongoClientPromise) {
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
  globalThis._mongoClientPromise = clientPromise;
}

export default clientPromise;

/**
 * Initialize DB: create collections with simple JSON Schema validators and indexes
 */
export async function initDB() {
  const client = await clientPromise;
  const db = client.db(); // uses default DB from connection string

  // Users collection
  const existingUsers = await db.listCollections({ name: "users" }).toArray();
  if (existingUsers.length === 0) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "name"],
          properties: {
            email: { bsonType: "string" },
            name: { bsonType: "string" }
          }
        }
      }
    });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  }

  // Topics collection
  const existingTopics = await db.listCollections({ name: "topics" }).toArray();
  if (existingTopics.length === 0) {
    await db.createCollection("topics", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["topic", "title", "date", "userId"],
          properties: {
            topic: { bsonType: "string" },
            title: { bsonType: "string" },
            notes: { bsonType: "string" },
            ingredients: { bsonType: "array", items: { bsonType: "string" } },
            date: { bsonType: "date" },
            userId: { bsonType: "objectId" }
          }
        }
      }
    });
    await db.collection("topics").createIndex({ userId: 1 });
  }

  return db;
}