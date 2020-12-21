import Guild, { Channel } from "./Guild";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user_id: string | null;
    error: string | null;
  };
  guild: {
    guilds: Guild[];
    guild: Guild | null;
  };
  channel: {
    channel: Channel | null;
  };
}

export default State;
