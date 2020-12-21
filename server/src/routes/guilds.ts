import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ChannelModel from "../models/Channel.model";
import GuildModel from "../models/Guild.model";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj } from "../utils/utils";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const data = await GuildModel.find();
  const channelData = await ChannelModel.find();
  const user = await UserModel.findById(req.user?._id);

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  const guilds = [];

  for (let i = 0; i < user.guilds.length; i++) {
    const channels = [];
    const guild = data.find((g) => g._id.toString() === user.guilds[i]);
    if (!guild) return;

    for (let i = 0; i < guild?.channel_ids?.length; i++) {
      const channel = channelData.find((ch) => ch._id.toString() === guild?.channel_ids[i]);

      channels.push(channel);
    }

    guilds.push({ ...(guild as any)?._doc, channels });
  }

  return res.json({ status: "success", guilds });
});

router.get("/:guild_id", useAuth, async (req: IRequest, res: Response) => {
  const { guild_id } = req.params;
  const user = await UserModel.findById(req.user?._id);
  const channelData = await ChannelModel.find();

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  if (user.guilds.find((id) => id !== guild_id)) {
    return res.json(errorObj("User is not in this guilds")).status(401);
  }

  const guild = await GuildModel.findById(guild_id);

  if (!guild) {
    return res.json(errorObj("Guild was not found"));
  }

  const channels = [];
  for (let i = 0; i < guild?.channel_ids?.length; i++) {
    const channel = channelData.find((ch) => ch._id.toString() === guild?.channel_ids[i]);

    channels.push(channel);
  }

  return res.json({ status: "success", guild: { ...(guild as any)._doc, channels: channels } });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.json(errorObj("Please provide a server name"));
  }

  const newGuild = new GuildModel({ name });
  const user = await UserModel.findById(req.user?._id);

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  user.guilds = [...user.guilds, newGuild._id.toString()];

  try {
    await newGuild.save();
    await user.save();
  } catch (e) {
    logger.error("create_guild", e);

    return res.json(errorObj("An unexpected error occurred, please try again later"));
  }

  return res.json({ status: "success", guild_id: newGuild._id });
});

export default router;
