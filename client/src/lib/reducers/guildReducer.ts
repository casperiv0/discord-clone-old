import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { GET_GUILD_BY_ID, GET_USER_GUILDS, GUILD_ERROR } from "../types";

const initState: State["guild"] = {
  guilds: [],
  guild: null,
  error: null,
};

type Actions =
  | {
      type: typeof GET_USER_GUILDS;
      guilds: Guild[];
    }
  | {
      type: typeof GET_GUILD_BY_ID;
      guild: Guild | null;
    }
  | {
      type: typeof GUILD_ERROR;
      error: string;
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
    case "GUILD_ERROR": {
      return {
        ...state,
        error: action.error,
      };
    }
    default: {
      return { ...state };
    }
  }
}
