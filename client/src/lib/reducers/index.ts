import { combineReducers } from "redux";
import authReducer from "./authReducer";
import guildReducer from "./guildReducer";
import channelReducer from "./channelReducer";

export default combineReducers({
  auth: authReducer,
  guild: guildReducer,
  channel: channelReducer,
});
