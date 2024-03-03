import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Topic from "@/models/topic";

export async function foodById(topicId) {
  await connectMongoDB();
  const objectId = new ObjectId(topicId);

  const entry = await Topic.findById(objectId);
  return entry;
}
