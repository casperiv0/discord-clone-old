import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../../utils/utils";
import { AUTHENTICATE, AUTH_ERROR } from "../types";

interface IDispatch {
  type: string;
  error?: string;
  user_id?: string;
}

export const login = (data: unknown) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void | string> => {
  try {
    const res = await handleRequest("/auth/login", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user_id: res.data.user_id,
      });

      return (window.location.href = "/");
    } else {
      dispatch({ type: AUTH_ERROR, error: res.data.error });
    }
  } catch (e) {
    console.error(e);
  }
};

export const register = (data: unknown) => async (
  dispatch: Dispatch<IDispatch>
): Promise<void | string> => {
  try {
    const res = await handleRequest("/auth/register", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user_id: res.data.user_id,
      });

      return (window.location.href = "/");
    } else {
      dispatch({ type: AUTH_ERROR, error: res.data.error });
    }
  } catch (e) {
    console.error(e);
  }
};
