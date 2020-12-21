import { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { GET_CHANNEL_BY_ID, CHANNEL_ERROR } from "../types";

const initState: State["channel"] = {
  channel: null,
  error: null,
};

type Actions =
  | {
      type: typeof GET_CHANNEL_BY_ID;
      channel: Channel;
    }
  | {
      type: typeof CHANNEL_ERROR;
      error: string;
    };

export default function channelReducer(state = initState, action: Actions): State["channel"] {
  switch (action.type) {
    case "GET_CHANNEL_BY_ID": {
      return {
        ...state,
        channel: action.channel,
      };
    }
    case "CHANNEL_ERROR": {
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
