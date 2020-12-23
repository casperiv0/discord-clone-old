import { model, Schema, Document } from "mongoose";

export interface Channel extends Document {
  name: string;
  topic: string;
  nsfw: boolean;
  guild_id: string;
  created_at: number;
  parent_id?: string;
  type: number;
}

const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 25,
  },
  topic: {
    type: String,
    default: null,
    maxlength: 1024,
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  guild_id: {
    type: String,
    required: true,
  },
  parent_id: {
    type: String,
    default: "no_parent",
  },
  type: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Number,
    default: () => Date.now(),
  },
});

export default model<Channel>("Channel", ChannelSchema);
