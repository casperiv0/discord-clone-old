import * as React from "react";
import User from "../../interfaces/User";
import { handleRequest, isSuccess } from "../../utils/utils";
import { AUTHENTICATE, AUTH_ERROR, SET_LOADING } from "../types";

interface IDispatch {
  type: string;
  error?: string;
  user?: User;
  loading?: boolean;
  isAuth?: boolean;
}

export const login = (data: unknown) => async (dispatch: React.Dispatch<IDispatch>): Promise<void | string> => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/login", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user: res.data.user,
      });

      return (window.location.href = "/");
    } else {
      dispatch({ type: AUTH_ERROR, error: res.data.error });
    }
  } catch (e) {
    console.error(e);
  }

  dispatch({ type: SET_LOADING, loading: false });
};

export const register = (data: unknown) => async (dispatch: React.Dispatch<IDispatch>): Promise<void | string> => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/register", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user: res.data.user,
      });

      return (window.location.href = "/");
    } else {
      dispatch({ type: AUTH_ERROR, error: res.data.error });
    }
  } catch (e) {
    console.error(e);
  }

  dispatch({ type: SET_LOADING, loading: false });
};

export const checkAuth = () => async (dispatch: React.Dispatch<IDispatch>): Promise<void | string> => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/user", "POST");

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user: res.data.user,
        isAuth: true,
      });
    } else {
      dispatch({ type: AUTH_ERROR, error: res.data.error });
      if (res.data?.invalid_token) {
        return (window.location.href = "/login");
      }
    }
  } catch (e) {
    console.error(e);
  }

  dispatch({ type: SET_LOADING, loading: false });
};
