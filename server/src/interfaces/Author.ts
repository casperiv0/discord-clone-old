import { User } from "../models/User.model";

interface Author {
  _id: User["_id"];
  username: User["username"];
  avatar_id: User["avatar_id"];
}

export default Author;
