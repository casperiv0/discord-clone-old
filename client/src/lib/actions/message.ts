import * as React from "react";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE_BY_ID,
  GET_MESSAGES_FOR_CHANNEL,
  SET_FETCHING_MSGS,
  UPDATE_MESSAGE_BY_ID,
} from "../types";
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

export const updateMessageById = (messageId: string, channelId: string, guildId: string, content: string) => async (
  dispatch: React.Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/message/${guildId}/${channelId}/${messageId}`, "PUT", { content });

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_MESSAGE_BY_ID,
      });
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_MESSAGE_BY_ID, e);
    return false;
  }
};

export const deleteMessageById = (messageId: string, channelId: string, guildId: string) => async (
  dispatch: React.Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/message/${guildId}/${channelId}/${messageId}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_MESSAGE_BY_ID,
      });
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(DELETE_MESSAGE_BY_ID, e);
    return false;
  }
};
