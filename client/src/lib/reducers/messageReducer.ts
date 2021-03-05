import Message from "../../interfaces/Message";
import State from "../../interfaces/State";
import { CREATE_MESSAGE, GET_MESSAGES_FOR_CHANNEL, SET_FETCHING_MSGS } from "../types";

const initState: State["message"] = {
  messages: [],
  loading: true,
};

type Actions =
  | {
      type: typeof CREATE_MESSAGE;
    }
  | {
      type: typeof GET_MESSAGES_FOR_CHANNEL;
      messages: Message[];
    }
  | {
      type: typeof SET_FETCHING_MSGS;
      loading: boolean;
    };

export default function messageReducer(state = initState, action: Actions): State["message"] {
  switch (action.type) {
    case "CREATE_MESSAGE": {
      return {
        ...state,
      };
    }
    case "GET_MESSAGES_FOR_CHANNEL": {
      return {
        ...state,
        messages: action.messages,
      };
    }
    case "SET_FETCHING_MSGS": {
      return {
        ...state,
        loading: action.loading,
      };
    }
    default: {
      return { ...state };
    }
  }
}
