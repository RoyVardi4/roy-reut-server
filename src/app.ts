import express, { Application } from "express";
import * as libs from "./lib";
import mongoose from "mongoose";

const appPromise = new Promise<Application>((resolve, reject) => {
  const app: express.Application = express();
  libs.default({ serverApp: app });
  mongoose
    .connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME || "roy-reut-db",
    })
    .then(() => resolve(app))
    .catch((error) => console.log(error.message));
});

export default appPromise;