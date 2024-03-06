import express from "express";
import expressLoader from "./express";

import Logger from "./logger";
import config from "../config/index";

// import injector from './injector'

export default ({ serverApp }: { serverApp: express.Application }) => {
  expressLoader({ app: serverApp });
  Logger.info(`${config.serverType} ready to go!!`);
};
