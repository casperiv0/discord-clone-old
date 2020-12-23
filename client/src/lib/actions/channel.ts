import { Dispatch } from "react";
import Guild, { Channel } from "../../interfaces/Guild";
import Logger from "../../utils/Logger";
import { closeModal, handleRequest, isSuccess } from "../../utils/utils";
import { GET_CHANNEL_BY_ID, CREATE_CHANNEL, CHANNEL_ERROR, UPDATE_CHANNEL_BY_ID } from "../types";

interface IDispatch {
  type: string;
  channel?: Channel;
  error?: string;
  loading?: boolean;
  guild?: Guild;
}

export const getChannelById = (channelId: string, guildId: string) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void | string> => {
  try {
    const res = await handleRequest(`/channels/${channelId}?guild_id=${guildId}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CHANNEL_BY_ID,
        channel: res.data.channel,
      });
      Logger.log(GET_CHANNEL_BY_ID, `Successfully fetched channel with id: ${channelId}`);
    }
  } catch (e) {
    console.error(e);
  }
};

export const createCategory = (name: string, guildId: string) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void> => {
  try {
    const res = await handleRequest(`/channels?guild_id=${guildId}&type=2`, "POST", { name });

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_CHANNEL,
      });
      closeModal("create-category-modal");
    } else {
      dispatch({
        type: CHANNEL_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_CHANNEL, e);
  }
};

export const createChannel = (name: string, guildId: string) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void> => {
  try {
    const res = await handleRequest(`/channels?guild_id=${guildId}&type=1`, "POST", {
      name,
    });

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_CHANNEL,
      });

      closeModal("create-channel-modal");
    } else {
      dispatch({
        type: CHANNEL_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_CHANNEL, e);
  }
};

export const updateChannel = (channelId: string, guildId: string, data: unknown) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void> => {
  try {
    const res = await handleRequest(`/channels/${channelId}?guild_id=${guildId}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: "",
      });

      Logger.log(UPDATE_CHANNEL_BY_ID, `Successfully updated channel with id: ${channelId}`);
    } else {
      dispatch({
        type: CHANNEL_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    console.error(e);
  }
};
