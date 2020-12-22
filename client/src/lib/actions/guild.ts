import { Dispatch } from "react";
import Guild from "../../interfaces/Guild";
import Logger from "../../utils/Logger";
import { handleRequest, isSuccess } from "../../utils/utils";
import { GET_GUILD_BY_ID, GET_USER_GUILDS, CREATE_GUILD, GUILD_ERROR } from "../types";

interface IDispatch {
  type: string;
  guilds?: Guild[];
  guild?: Guild;
  error?: string;
  loading?: boolean;
}

export const createGuild = (data: unknown) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void> => {
  try {
    const res = await handleRequest("/guilds", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_GUILD,
      });
    } else {
      dispatch({
        type: GUILD_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error("create_guild", e);
  }
};

export const getUserGuilds = () => async (
  dispatch: Dispatch<IDispatch>
): Promise<void | string> => {
  try {
    const res = await handleRequest("/guilds", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_USER_GUILDS,
        guilds: res.data.guilds,
      });
      Logger.log(GET_USER_GUILDS, "Successfully fetched user guilds");
    }
  } catch (e) {
    console.error(e);
  }
};

export const getGuildById = (id: string) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void> => {
  try {
    const res = await handleRequest(`/guilds/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_GUILD_BY_ID,
        guild: res.data.guild,
      });
      Logger.log(GET_USER_GUILDS, `Successfully fetched guild with id: ${id}`);
    }
  } catch (e) {
    console.error(e);
  }
};
