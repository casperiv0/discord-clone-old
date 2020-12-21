import { Router, Response } from "express";
import slugify from "slugify";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ChannelModel from "../models/Channel.model";
import GuildModel from "../models/Guild.model";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj } from "../utils/utils";

const router = Router();

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { guild_id } = req.query;
  const { name } = req.body;

  if (!guild_id) {
    return res.json(errorObj("You must provide a guild_id"));
  }

  if (!name) {
    return res.json(errorObj("Please provide a channel name"));
  }

  const newChannel = new ChannelModel({
    name: slugify(name, { replacement: "-", lower: true }),
    guild_id,
  });
  const guild = await GuildModel.findById(guild_id);

  if (!guild) {
    return res.json(errorObj("Guild was not found"));
  }

  guild.channel_ids = [...guild.channel_ids, newChannel._id.toString()];

  try {
    await newChannel.save();
    await guild.save();
  } catch (e) {
    logger.error("create_channel", e);
    return res.json(errorObj("An unexpected error occurred, please try again later"));
  }

  return res.json({ status: "success", channel_id: newChannel._id });
});

router.get("/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { channel_id } = req.params;
  const { guild_id } = req.query;

  if (channel_id === "undefined" || !channel_id) {
    return res.json(errorObj("You must provide a channel_id"));
  }

  if (!guild_id) {
    return res.json(errorObj("You must provide a guild_id"));
  }

  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  if (!user.guilds.includes(String(guild_id))) {
    return res.json(errorObj("User is not in this guild")).status(401);
  }

  const channel = await ChannelModel.findById(String(channel_id));

  if (!channel) {
    return res.json(errorObj("Channel was not found"));
  }

  if (channel?.guild_id.toString() !== guild_id) {
    return res.json(errorObj("Guild id's do not match"));
  }

  return res.json({ status: "success", channel: channel });
});

router.delete("/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { channel_id } = req.params;
});

export default router;
