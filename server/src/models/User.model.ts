import { model, Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  avatar_id: string;
  created_at: number;
  discriminator: string;

  /**
   * An array of guild Id's
   */
  guilds: string[];
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  guilds: {
    type: Array,
    default: [],
  },
  avatar_id: {
    type: String,
    default: "default",
  },
  discriminator: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    default: () => Date.now(),
  },
});

export default model<User>("User", UserSchema);
