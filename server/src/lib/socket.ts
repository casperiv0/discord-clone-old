import { Socket } from "socket.io";
import { MessageCreate } from "../interfaces/Events";
import MessageModel from "../models/Message.model";
import { io } from "../server";

io.on("connection", async (socket: Socket) => {
  socket.on("messageCreate", (data: MessageCreate) => {
    // TODO: only send message to room
  });
});
