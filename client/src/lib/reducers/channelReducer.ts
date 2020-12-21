import { Channel } from "../../interfaces/Guild";
import State from "../../interfaces/State";
import { GET_CHANNEL_BY_ID } from "../types";

const initState: State["channel"] = {
  channel: null,
};

type Actions = {
  type: typeof GET_CHANNEL_BY_ID;
  channel: Channel;
};

export default function channelReducer(state = initState, action: Actions): State["channel"] {
  switch (action.type) {
    case "GET_CHANNEL_BY_ID": {
      return {
        ...state,
        channel: action.channel,
      };
    }
    default: {
      return { ...state };
    }
  }
}
