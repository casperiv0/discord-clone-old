import "dotenv/config";
import "./utils/database";
import express, { Application, json } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import api from "./api";
import Logger from "./utils/logger";

const app: Application = express();
const port = Number(process.env.PORT) || 3030;

app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
app.use(morgan("dev"));
app.use("/api", api);

app.listen(port, () => Logger.log("APP", `App is running at: http://localhost:${port}`));
