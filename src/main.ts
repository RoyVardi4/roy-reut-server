import express from "express";
import config from "./config/index";
import Logger from "./lib/logger";
import * as libs from "./lib";
import mongoose from "mongoose";

const app: express.Application = express();
libs.default({ serverApp: app });
mongoose
  .connect(process.env.DATABASE_URL, {
    dbName: process.env.DATABASE_NAME || "roy-reut-db",
  })
  .then(
    () =>
      app &&
      app.listen(config.port, () => {
        Logger.info(`
⚡️---------------------------------------------------⚡️
⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
⚡️|	    Ready now on port: ${config.port}           |⚡️
⚡️---------------------------------------------------⚡️

  `);
      })
  )
  .catch((error) => console.log(error.message));

export default app;
