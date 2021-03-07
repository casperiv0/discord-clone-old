import Guild, { Channel } from "./Guild";
import Message from "./Message";
import User from "./User";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User | null;
    error: string | null;
  };
  guild: {
    guilds: Guild[];
    guild: Guild | null;
    error: string | null;
    loading: boolean;
  };
  channel: {
    channel: Channel | null;
    error: string | null;
  };
  message: {
    messages: Message[];
    loading: boolean;
  };
}

export default State;
