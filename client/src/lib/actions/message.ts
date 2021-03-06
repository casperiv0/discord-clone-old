import * as React from "react";
import { CREATE_MESSAGE, GET_MESSAGES_FOR_CHANNEL, SET_FETCHING_MSGS } from "../types";
import Message from "../../interfaces/Message";
import Logger from "../../utils/Logger";
import { handleRequest, isSuccess } from "../../utils/utils";

interface IDispatch {
  type: string;
  message?: Message;
  messages?: Message[];
  loading?: boolean;
}

export const getMessages = (guildId: string, channelId: string) => async (dispatch: React.Dispatch<IDispatch>) => {
  try {
    dispatch({ type: SET_FETCHING_MSGS, loading: true });
    const res = await handleRequest(`/message/${guildId}/${channelId}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MESSAGES_FOR_CHANNEL,
        messages: res.data.messages,
      });
    }
  } catch (e) {
    Logger.error("GET_MESSAGES", e);
  } finally {
    dispatch({ type: SET_FETCHING_MSGS, loading: false });
  }
};

export const createMessage = (message: string, guildId: string, channelId: string) => async (
  dispatch: React.Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/message", "POST", {
      content: message,
      guild_id: guildId,
      channel_id: channelId,
    });

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_MESSAGE,
      });

      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error("CREATE_MESSAGE", e);
    return false;
  }
};
