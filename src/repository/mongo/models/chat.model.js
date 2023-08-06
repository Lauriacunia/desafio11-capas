import { Schema, model } from "mongoose";

export const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

export default model("chat", chatSchema);
