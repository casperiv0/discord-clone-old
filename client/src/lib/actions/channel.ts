import { Dispatch } from "react";
import { Channel } from "../../interfaces/Guild";
import Logger from "../../utils/Logger";
import { handleRequest, isSuccess } from "../../utils/utils";
import { GET_CHANNEL_BY_ID } from "../types";

interface IDispatch {
  type: string;
  channel?: Channel;
  error?: string;
  loading?: boolean;
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
