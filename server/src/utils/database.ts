import { connect } from "mongoose";

(async function database() {
  const uri = String(process.env.MONGO_URI);
  try {
    await connect(uri, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (e) {
    console.log(e);
  }
})();
