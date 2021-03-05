import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { AUTHENTICATE, AUTH_ERROR, SET_LOADING } from "../types";

const initState: State["auth"] = {
  isAuth: false,
  loading: false,
  user: null,
  error: null,
};

type Actions =
  | {
      type: typeof AUTHENTICATE;
      user: User;
      isAuth: boolean;
    }
  | {
      type: typeof AUTH_ERROR;
      error: string;
    }
  | {
      type: typeof SET_LOADING;
      loading: boolean;
    };

export default function authReducer(
  state = initState,
  action: Actions
): State["auth"] {
  switch (action.type) {
    case "AUTHENTICATE": {
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
        error: null,
      };
    }
    case "AUTH_ERROR": {
      return {
        ...state,
        error: action.error,
      };
    }
    case "SET_LOADING": {
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
