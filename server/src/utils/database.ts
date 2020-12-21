import { connect } from "mongoose";
import logger from "./logger";

(async function database() {
  const uri = String(process.env.MONGO_URI);
  try {
    await connect(uri, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.log("database", "Connected to mongodb");
  } catch (e) {
    logger.error("database", e);
  }
})();
