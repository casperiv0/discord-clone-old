import { Router } from "express";
import authRouter from "./routes/auth";
import guildRouter from "./routes/guilds";
import channelRouter from "./routes/channels";
const api: Router = Router();

api.use("/auth", authRouter);
api.use("/guilds", guildRouter);
api.use("/channels", channelRouter);

export default api;
