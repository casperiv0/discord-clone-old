import { combineReducers } from "redux";
import authReducer from "./authReducer";
import guildReducer from "./guildReducer";
import channelReducer from "./channelReducer";
import messageReducer from "./messageReducer";

export default combineReducers({
  auth: authReducer,
  guild: guildReducer,
  channel: channelReducer,
  message: messageReducer,
});
