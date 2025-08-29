import { getServerSession } from "next-auth";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Topic from "@/models/topic";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function tableByDay(date, topic) {
  const session = await getServerSession(authOptions);
  const email = session.user.email;

  await connectMongoDB();
  const user = await User.findOne({ email });
  const userId = user._id.toString();
  console.log(topic);

  if (date !== undefined || topic === undefined) {
    const entry = await Topic.find({
      $and: [{ userId: userId }, { date: date }],
    });

    return entry;
  } else if (date === undefined || topic !== undefined) {
    const entry = await Topic.find({
      $and: [{ userId: userId }, { topic: topic }],
    });

    return entry;
  } else {
    const entry = await Topic.find({
      $and: [{ userId: userId }, { date: date }, { topic: topic }],
    });

    return entry;
  }
}
