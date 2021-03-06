import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import ChannelModel, { Channel } from "../models/Channel.model";
import GuildModel, { Guild } from "../models/Guild.model";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj } from "../utils/utils";

const router = Router();

function returnGuildChannels(guild: Guild, channelData: Channel[]) {
  const categoryChannels = [];
  const noCategoryChannels = [];

  for (let i = 0; i < guild.category_ids.length; i++) {
    const category = channelData.find((ch) => ch._id.toString() === guild.category_ids[i]);
    const data = channelData.filter((ch) => ch.parent_id === guild.category_ids[i]);

    categoryChannels.push({
      channels: data,
      ...(category as any)?._doc,
    });
  }

  const noCateChannels = channelData.filter(
    (ch) => ch.parent_id === "no_parent" && ch?.type === 1 && ch?.guild_id === guild._id.toString(),
  );

  noCategoryChannels.push({ channels: noCateChannels });

  return { categoryChannels, noCategoryChannels };
}

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  try {
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

      for (let i = 0; i < (guild?.channel_ids?.length || 0); i++) {
        const channel = channelData.find((ch) => ch._id.toString() === guild?.channel_ids[i]);

        channels.push(channel);
      }

      guilds.push({ ...(guild as any)?._doc, channels });
    }

    return res.json({ status: "success", guilds });
  } catch (e) {
    console.error(e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

router.get("/:guild_id", useAuth, async (req: IRequest, res: Response) => {
  const { guild_id } = req.params;
  const user = await UserModel.findById(req.user?._id);
  const channelData = await ChannelModel.find();

  if (!user) {
    return res.json(errorObj("User was not found"));
  }

  if (!user.guilds.includes(guild_id)) {
    return res.json(errorObj("User is not in this guild")).status(401);
  }

  const guild = await GuildModel.findById(guild_id);

  if (!guild) {
    return res.json(errorObj("Guild was not found"));
  }

  const categories = returnGuildChannels(guild, channelData);

  return res.json({
    status: "success",
    guild: { ...(guild as any)._doc, categories: categories },
  });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.json(errorObj("Please provide a server name"));
    }

    const newGuild = await GuildModel.create({
      name,
      owner_id: `${req.user?._id}`,
    });

    const category = await new ChannelModel({
      type: 2,
      name: "General",
      guild_id: `${newGuild._id}`,
    }).save();

    console.log(category);
    console.log(newGuild);

    const channel = new ChannelModel({
      parent_id: `${category._id}`,
      type: 1,
      name: "General",
      guild_id: `${newGuild._id}`,
    });
    await channel.save();

    const user = await UserModel.findById(req.user?._id);

    if (!user) {
      return res.json(errorObj("User was not found"));
    }

    user.guilds = [...user.guilds, newGuild._id.toString()];

    newGuild.channel_ids = [channel._id?.toString()];
    newGuild.category_ids = [category._id?.toString()];
    await newGuild.save();
    await user.save();

    return res.json({ status: "success", guild_id: newGuild._id });
  } catch (e) {
    logger.error("create_guild", e);

    return res.json(errorObj("An unexpected error occurred, please try again later")).status(500);
  }
});

router.delete("/:guild_id", useAuth, async (req: IRequest, res: Response) => {
  const { guild_id } = req.params;

  try {
    const user = await UserModel.findById(req.user?._id);

    if (!user?.guilds.includes(guild_id)) {
      return res.json(errorObj("You are not in this guild"));
    }

    const guild = await GuildModel.findById(guild_id);

    if (guild?.owner_id?.toString() !== user?._id?.toString()) {
      return res.json(errorObj("You are not the owner of this guild"));
    }

    await guild?.delete();
    user.guilds = user.guilds.filter((g) => g.toString() !== guild_id);
    await user.save();

    return res.json({
      status: "success",
    });
  } catch (e) {
    logger.error("DELETE_GUILD", e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

export default router;
