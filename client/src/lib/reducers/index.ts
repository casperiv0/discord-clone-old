import { combineReducers } from "redux";
import authReducer from "./authReducer";
import guildReducer from "./guildReducer";

export default combineReducers({
  auth: authReducer,
  guild: guildReducer,
});
