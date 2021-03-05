import { io, Socket } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL!);

socket.on("connection", (socket: Socket) => {
  console.log(socket.id);

  console.log("Connected");
});

export default socket;
