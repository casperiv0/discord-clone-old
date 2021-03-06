import "dotenv/config";
import "./utils/database";
import express, { Application, json } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import csurf from "csurf";

import api from "./api";
import Logger from "./utils/logger";

const app: Application = express();
const port = Number(process.env.PORT) || 3030;
const server = app.listen(port, () => Logger.log("APP", `App is running at: http://localhost:${port}`));

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  cookie: {
    httpOnly: true,
  },
});

const protection = csurf({ cookie: true });

app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
app.use(morgan("dev"));
app.use("/api/v1", api, protection);

export { io };
import("./lib/socket");
