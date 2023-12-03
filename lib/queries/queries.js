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
    $and: [{ userId: userId }, { topic: "Food" }],
  })
    .sort({ createdAt: -1 })
    .limit(1);

  return entry;
}
