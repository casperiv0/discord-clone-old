import { Router, Response } from "express";
import { v4 as uuid } from "uuid";
import { useAuth } from "../hooks";
import useValidObjectId from "../hooks/useValidObjectId";
import IRequest from "../interfaces/IRequest";
import ChannelModel from "../models/Channel.model";
import GuildModel from "../models/Guild.model";
import InviteModel from "../models/Invite.model";
import UserModel from "../models/User.model";
import logger from "../utils/logger";
import { errorObj } from "../utils/utils";

const router = Router();

router.get("/:invite_code", useValidObjectId("invite_code"), useAuth, async (req: IRequest, res: Response) => {
  const { invite_code } = req.params;

  try {
    const invite = await InviteModel.findOne({ code: invite_code });

    if (!invite) {
      return res.json(errorObj("invite not found")).status(404);
    }
  } catch (e) {
    logger.error("GET_INVITE_CODE", e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

/**
 * create an invite
 */
router.post("/:guild_id", useValidObjectId("guild_id"), useAuth, async (req: IRequest, res: Response) => {
  const { guild_id } = req.params;

  try {
    const code = uuid().slice(0, 6);
    const author = await UserModel.findById(req.user, { username: 1, _id: 1, avatar_id: 1, discriminator: 1 });

    const newInvite = await InviteModel.create({
      code: code,
      guild_id,
      author,
    });

    newInvite.save();

    return res.json({
      status: "success",
      invite: newInvite,
    });
  } catch (e) {
    logger.error("CREATE_INVITE_CODE", e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

/**
 * Join a guild with the invite code
 */
router.post("/code/:invite_code", useAuth, async (req: IRequest, res: Response) => {
  const { invite_code } = req.params;

  try {
    const invite = await InviteModel.findOne({ code: invite_code });

    if (!invite) {
      return res.json(errorObj("invite not found")).status(404);
    }

    const user = await UserModel.findById(req.user);
    const guild = await GuildModel.findById(invite?.guild_id);

    if (!guild) {
      return res.json(errorObj("guild not found"));
    }

    if (!user) {
      return res.json(errorObj("user not found"));
    }

    if (user.guilds.includes(guild._id?.toString())) {
      return res.json(errorObj("you are already in this guild"));
    }

    if (user.guilds.length >= 100) {
      return res.json(errorObj("cannot join more than 100 guilds"));
    }

    await UserModel.findByIdAndUpdate(user._id, { guilds: [...user.guilds, invite.guild_id] });
    await GuildModel.findByIdAndUpdate(guild._id, { member_ids: [...guild.member_ids, req.user!] });

    return res.json({
      status: "success",
      guildId: guild?._id,
      channelId: guild.channel_ids[0],
    });
  } catch (e) {
    logger.error("GET_INVITE_CODE", e);
    return res.json(errorObj("An error occurred")).status(500);
  }
});

export default router;
