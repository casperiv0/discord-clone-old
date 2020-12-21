import guilds, { channels } from "../../data/guilds";
import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { GET_GUILD_BY_ID, GET_USER_GUILDS } from "../types";

const initState: State["guild"] = {
  guilds: guilds,
  guild: guilds[0],
  channels: channels,
};

type Actions =
  | {
      type: typeof GET_USER_GUILDS;
      guilds: Guild[];
    }
  | {
      type: typeof GET_GUILD_BY_ID;
      guild: Guild | null;
    };

export default function guildReducer(state = initState, action: Actions): State["guild"] {
  switch (action.type) {
    case "GET_USER_GUILDS": {
      return {
        ...state,
        guilds: action.guilds,
      };
    }
    case "GET_GUILD_BY_ID": {
      return {
        ...state,
        guild: action.guild,
      };
    }
    default: {
      return { ...state };
    }
  }
}
