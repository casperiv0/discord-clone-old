import User from "./User";

interface Message {
  _id: string;
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

export default Message;
