import { model, Schema, Document } from "mongoose";
import { User } from "./User.model";

export interface Message extends Document {
  content: string;
  guild_id: string;
  created_at: number;
  channel_id: string;
  author: {
    _id: User["_id"];
    username: User["username"];
    avatar_id: User["avatar_id"];
  };
}

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  guild_id: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  created_at: {
    type: Number,
    default: () => Date.now(),
  },
});

export default model<Message>("Message", MessageSchema);
