import { model, Schema, Document } from "mongoose";

export interface Guild extends Document {
  name: string;
  region: string;
  avatar_id: string;
  created_at: number;
  channel_ids: string[];
  channels?: unknown[];
}

const GuildSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  region: {
    type: String,
    default: "europe",
  },
  channel_ids: {
    type: Array,
    default: [],
  },
  avatar_id: {
    type: String,
    default: null,
  },
  created_at: {
    type: Number,
    default: () => Date.now(),
  },
});

export default model<Guild>("Guild", GuildSchema);
