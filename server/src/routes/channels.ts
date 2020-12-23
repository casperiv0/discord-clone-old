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
  const { guild_id, type } = req.query;
  const { name, parent_id } = req.body;

  if (!guild_id) {
    return res.json(errorObj("You must provide a guild_id")).status(400);
  }

  if (!name) {
    return res.json(errorObj("Please provide a channel name")).status(400);
  }

  if (name.length > 25) {
    return res.json(errorObj("Channel name cannot be longer than 25 characters")).status(400);
  }

  const newChannel = new ChannelModel({
    name: type === "1" ? slugify(name, { replacement: "-", lower: true }) : name,
    guild_id,
    type: Number(type),
    parent_id: type === "1" ? parent_id : "no_parent",
  });

  const guild = await GuildModel.findById(guild_id);

  if (!guild) {
    return res.json(errorObj("Guild was not found")).status(404);
  }

  switch (type) {
    case "1": {
      guild.channel_ids = [...guild.channel_ids, newChannel._id.toString()];
      break;
    }
    case "2": {
      guild.category_ids = [...guild.category_ids, newChannel._id.toString()];
      break;
    }
    default: {
      return res.json(errorObj("Invalid type was provided")).status(400);
    }
  }

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

router.put("/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { channel_id } = req.params;
  const { guild_id } = req.query;
  const { topic, name } = req.body;

  if (!name) {
    return res.json(errorObj("You must provide a name"));
  }

  if (name.length > 25) {
    return res.json(errorObj("Channel name cannot be longer than 25 characters")).status(400);
  }

  if (topic && topic.length > 1024) {
    return res.json(errorObj("Channel topic cannot be longer than 1024 characters")).status(400);
  }

  if (!guild_id) {
    return res.json(errorObj("You must provide a `guild_id`"));
  }

  const user = await UserModel.findById(req.user?._id);
  const channel = await ChannelModel.findById(channel_id);

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  if (!channel) {
    return res.json(errorObj("Channel was not found"));
  }

  if (!user.guilds.includes(String(guild_id))) {
    return res.json(errorObj("User is not in this guild")).status(401);
  }

  try {
    await ChannelModel.findByIdAndUpdate(channel?._id, {
      name: name,
      topic: topic,
    });
  } catch (e) {
    logger.error("UPDATE_CHANNEL", e);
  }

  return res.json({ status: "success" });
});

router.delete("/:channel_id", useAuth, async (req: IRequest, res: Response) => {
  const { channel_id } = req.params;
  const { guild_id } = req.query;

  if (!guild_id) {
    return res.json(errorObj("You must provide a `guild_id`"));
  }

  const guild = await GuildModel.findById(guild_id);
  const user = await UserModel.findById(req.user?._id);
  const channel = await ChannelModel.findById(channel_id);

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  if (!user.guilds.includes(String(guild_id))) {
    return res.json(errorObj("User is not in this guild")).status(401);
  }

  switch (channel?.type) {
    case 1: {
      if (!guild?.channel_ids.includes(channel_id)) {
        return res.json(errorObj("Channel does not exist in this guild"));
      }
      break;
    }
    case 2: {
      if (!guild?.category_ids.includes(channel_id)) {
        return res.json(errorObj("Channel does not exist in this guild"));
      }
      break;
    }
    default: {
      return res.json(errorObj("Type was invalid"));
    }
  }

  try {
    await ChannelModel.findByIdAndDelete(channel?._id);

    if (channel?.type === 1) {
      await GuildModel.findByIdAndUpdate(guild?._id, {
        channel_ids: guild.channel_ids.filter((id) => id !== channel_id),
      });
    } else {
      await GuildModel.findByIdAndUpdate(guild?._id, {
        category_ids: guild.category_ids.filter((id) => id !== channel_id),
      });
    }
  } catch (e) {
    logger.error("delete_channel", e);
    return res.json(errorObj("An unexpected error occurred, please try again later")).status(500);
  }

  return res.json({ status: "success" });
});

export default router;
