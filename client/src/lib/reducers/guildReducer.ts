import Guild from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { GET_GUILD_BY_ID, GET_USER_GUILDS, SET_LOADING } from "../types";

const initState: State["guild"] = {
  guilds: [],
  guild: null,
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
      type: typeof SET_LOADING;
      loading: boolean;
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
