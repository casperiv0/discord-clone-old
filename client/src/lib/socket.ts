import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL!);

socket.on("connect", () => {
  // TODO: add support for DM's
  const [, guildId, channelId] = window.location.pathname.split("/").filter(Boolean);

  socket.emit("joinChannel", guildId, channelId);
});

export function joinChannel(guildId: string, channelId: string) {
  socket.emit("joinChannel", guildId, channelId);
}

export default socket;
