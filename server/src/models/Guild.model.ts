import { model, Schema, Document } from "mongoose";
import { User } from "./User.model";

export type Permissions = "ADMIN" | "MANAGE_GUILD";

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

  /**
   * @requires first element = ownerId
   */
  member_ids: Member[];
}

export interface Member {
  user_id: string;
  user: User;
  permissions: Permissions[];
}

const GuildSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  owner_id: {
    type: String,
    required: true,
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
  member_ids: {
    type: Array,
    required: true,
  },
});

export default model<Guild>("Guild", GuildSchema);
