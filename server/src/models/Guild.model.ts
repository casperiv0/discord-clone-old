import { model, Schema, Document } from "mongoose";

export interface Guild extends Document {
  name: string;
  owner_id: string;
  region: string;
  avatar_id: string;
  created_at: number;
  channel_ids: string[];
  category_ids: string[];
  channels?: unknown[];
  categories?: unknown[];
}

const GuildSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  owner_id: {
    type: String,
    default: null, // TODO: change this
  },
  region: {
    type: String,
    default: "europe",
  },
  channel_ids: {
    type: Array,
    default: [],
  },
  category_ids: {
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
