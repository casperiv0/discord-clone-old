import { io } from "../server";
import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj, isUserAndChannelInGuild } from "../utils/utils";
import MessageModel from "../models/Message.model";
import GuildModel from "../models/Guild.model";
import ChannelModel from "../models/Channel.model";
import useValidObjectId from "../hooks/useValidObjectId";

const router = Router();

router.get(
  "/:guild_id/:channel_id",
  useValidObjectId("guild_id", "channel_id"),
  useAuth,
  async (req: IRequest, res: Response) => {
    const { guild_id, channel_id } = req.params;
    try {
      const msg = await isUserAndChannelInGuild(req.user, channel_id, guild_id);

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
  },
);

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { content, guild_id, channel_id } = req.body;

  try {
    if (!content || !guild_id || !channel_id) {
      return res.json(errorObj("Please fill in all fields"));
    }

    const msg = await isUserAndChannelInGuild(req.user, channel_id, guild_id);

    if (msg !== true) {
      return res.json(errorObj(msg));
    }

    const author = await UserModel.findById(req.user, { username: 1, _id: 1, avatar_id: 1, discriminator: 1 });
    const messages = await MessageModel.find({ guild_id, channel_id });

    const message = new MessageModel({
      content,
      guild_id,
      channel_id,
      author: {
        username: author?.username,
        _id: author?._id,
        avatar_id: author?.avatar_id,
        discriminator: author?.discriminator,
      },
    });

    message.save();

    io.sockets.in(`guild_${guild_id}_${channel_id}`).emit("messageCreate", message);

    return res.json({
      status: "success",
      messages: [...messages, message],
    });
  } catch (e) {
    logger.error("CREATE_MESSAGE", e);

    return res.json(errorObj("An error occurred")).status(500);
  }
});

router.delete(
  "/:guild_id/:channel_id/:message_id",
  useValidObjectId("guild_id", "channel_id", "message_id"),
  useAuth,
  async (req: IRequest, res: Response) => {
    const { guild_id, channel_id, message_id } = req.params;

    const msg = await isUserAndChannelInGuild(req.user, channel_id, guild_id);

    if (msg !== true) {
      return res.json(errorObj(msg));
    }

    const guild = await GuildModel.findById(guild_id);
    const channel = await ChannelModel.findById(channel_id);
    const message = await MessageModel.findById(message_id);

    if (!message) {
      return res.json(errorObj("Message was not found"));
    }

    if (message?.author._id.toString() !== req.user?.toString()) {
      // TODO: have permissions here too soon™
      return res.json(errorObj("You are not this message author"));
    }

    if (message?.guild_id !== guild?._id.toString()) {
      return res.json(errorObj("This message is not from this guild"));
    }

    if (message?.channel_id !== channel?._id.toString()) {
      return res.json(errorObj("This message is not from this channel"));
    }

    await MessageModel.findByIdAndDelete(message?._id);

    io.sockets.to(`guild_${guild_id}_${channel_id}`).emit("messageDelete", message?._id);

    return res.json({
      status: "success",
    });
  },
);

router.put(
  "/:guild_id/:channel_id/:message_id",
  useValidObjectId("guild_id", "channel_id", "message_id"),
  useAuth,
  async (req: IRequest, res: Response) => {
    const { guild_id, channel_id, message_id } = req.params;
    const { content } = req.body;

    try {
      const msg = await isUserAndChannelInGuild(req.user, channel_id, guild_id);
      if (msg !== true) {
        return res.json(errorObj(msg));
      }

      const message = await MessageModel.findById(message_id);

      if (!message) {
        return res.json(errorObj("Message was not found"));
      }

      if (message?.author._id.toString() !== req.user?.toString()) {
        return res.json(errorObj("you are not this message author"));
      }

      message.content = content;

      await message.save();

      io.sockets.to(`guild_${guild_id}_${channel_id}`).emit("messageUpdate", { content, _id: message?._id });

      return res.json({
        status: "success",
      });
    } catch (e) {
      logger.error("UPDATE_MESSAGE", e);
      return res.json(errorObj("an error occurred")).status(500);
    }
  },
);

export default router;
