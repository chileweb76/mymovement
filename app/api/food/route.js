import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Food from "@/models/food";

export async function POST(req) {
  try {
    const body = req.json();
    const foodData = body.foodData;
    await Food.create(foodData);
    await connectMongoDB();
    return NextResponse.json(
      { message: "Food Entry Created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
