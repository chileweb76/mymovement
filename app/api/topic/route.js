import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";
import Topic from "@/models/topic";
import User from "@/models/user";

export async function POST(req) {
  try {
    const { topic, title, notes, email, ingredients } = await req.json();

    await connectMongoDB();
    const user = await User.findOne({ email });
    const userId = user._id;
    await Topic.create({ topic, title, notes, userId, ingredients });
    return NextResponse.json({ message: "Topic created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
