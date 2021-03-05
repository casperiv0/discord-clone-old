import Guild, { Channel } from "./Guild";
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
  };
  channel: {
    channel: Channel | null;
    error: string | null;
  };
}

export default State;
