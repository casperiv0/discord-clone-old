import { model, Schema, Document } from "mongoose";
import Author from "../interfaces/Author";

export interface Invite extends Document {
  code: string;
  created_at: number;
  author: Author;
  guild_id: string;
}

const InviteSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  guild_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    default: () => Date.now(),
  },
});

export default model<Invite>("Invite", InviteSchema);
