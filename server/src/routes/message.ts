import { io } from "../server";

import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
// import ChannelModel, { Channel } from "../models/Channel.model";
// import GuildModel, { Guild } from "../models/Guild.model";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj, isUserAndChannelInGuild } from "../utils/utils";
import MessageModel from "../models/Message.model";

const router = Router();

router.get("/:guild_id/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { guild_id, channel_id } = req.params;
  try {
    const msg = await isUserAndChannelInGuild(req.user?._id, channel_id, guild_id);

    if (msg !== true) {
      return res.json(errorObj(msg));
    }

    const messages = await MessageModel.find({ guild_id, channel_id });

    return res.json({
      status: "success",
      messages,
    });
  } catch (e) {
    console.error(e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { content, guild_id, channel_id } = req.body;

  try {
    if (!content || !guild_id || !channel_id) {
      return res.json(errorObj("Please fill in all fields"));
    }

    const msg = await isUserAndChannelInGuild(req.user?._id, channel_id, guild_id);

    if (msg !== true) {
      return res.json(errorObj(msg));
    }

    const author = await UserModel.findById(req.user?._id, { username: 1, _id: 1, avatar_id: 1 });
    const messages = await MessageModel.find({ guild_id, channel_id });

    const message = new MessageModel({
      content,
      guild_id,
      channel_id,
      author: { username: author?.username, _id: author?._id, avatar_id: author?.avatar_id },
    });

    message.save();

    io.sockets.emit("messageCreate", message);

    return res.json({
      status: "success",
      messages: [...messages, message],
    });
  } catch (e) {
    logger.error("CREATE_MESSAGE", e);

    return res.json(errorObj("An error occurred")).status(500);
  }
});

export default router;
