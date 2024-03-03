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
