import { Router } from "express";
import authRouter from "./routes/auth";
import guildRouter from "./routes/guilds";
import channelRouter from "./routes/channels";
import messageRouter from "./routes/message";
import { errorObj } from "./utils/utils";
const api: Router = Router();

api.use("/auth", authRouter);
api.use("/guilds", guildRouter);
api.use("/channels", channelRouter);
api.use("/message", messageRouter);

api.use((req, res) => {
  return res.json(errorObj("404 - route not found"));
});

export default api;
