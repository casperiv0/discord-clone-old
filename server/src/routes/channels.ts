import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ChannelModel from "../models/Channel.model";
import GuildModel from "../models/Guild.model";
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

  const newChannel = new ChannelModel({ name, guild_id });
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

router.delete("/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { channel_id } = req.params;
  
});

export default router;
