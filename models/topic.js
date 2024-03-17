import mongoose, { Schema } from "mongoose";
import user from "./user";

const topicSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Topic || mongoose.model("Topic", topicSchema);
