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
  return db.collection("topics");
}

/**
 * Get all entries for a specific date and user
 * @param {string} userEmail - User's email
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string[]} topics - Array of topics to filter by (optional)
 * @returns {Promise<Array>} Array of entries
 */
export async function getEntriesForDate(userEmail, dateString, topics = []) {
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
  
  // Create date range for the selected day
  // Parse the date string as local date, not UTC
  const [year, month, day] = dateString.split('-').map(Number);
  
  const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  
  console.log('[dailySummary] Query range:', {
    dateString,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    localStartDate: startDate.toLocaleString(),
    localEndDate: endDate.toLocaleString()
  });
  
  // Build query
  const query = {
    userId: user._id,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  // Add topic filter if provided
  if (topics.length > 0) {
    query.topic = { $in: topics };
  }
  
  const docs = await col.find(query).sort({ date: -1 }).toArray();
  
  console.log('[dailySummary] Found entries:', docs.length);
  if (docs.length > 0) {
    console.log('[dailySummary] Sample entry dates:', docs.slice(0, 3).map(d => ({
      title: d.title,
      date: d.date?.toISOString(),
      topic: d.topic
    })));
  }
  
  // Map to include id and createdAt for frontend consumption
  return docs.map((doc) => ({
    ...doc,
    id: doc._id ? String(doc._id) : undefined,
    createdAt: doc.date || doc.createdAt,
  }));
}
