import { isValidObjectId } from "mongoose";
import { Socket } from "socket.io";
import ChannelModel from "../models/Channel.model";
import GuildModel from "../models/Guild.model";
import { io } from "../server";
import logger from "../utils/logger";

io.on("connection", async (socket: Socket) => {
  socket.on("joinChannel", async (guildId: string, channelId: string) => {
    const guild = isValidObjectId(guildId) && (await GuildModel.findById(guildId));
    const channel = isValidObjectId(channelId) && (await ChannelModel.findById(channelId));

    if (!guild) {
      logger.log("JOIN_CHANNEL", `INVALID_GUILD: ${guildId}`);
      return socket.to(socket.id).emit("INVALID_GUILD");
    }

    if (!channel) {
      logger.log("JOIN_CHANNEL", `INVALID_CHANNEL: ${guildId}`);
      return socket.to(socket.id).emit("INVALID_CHANNEL");
    }

    socket.join(`guild_${guild._id}_${channel._id}`);
  });
});
