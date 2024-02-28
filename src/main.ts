import express, { Application } from "express";
import config from "./config/index";
import Logger from "./lib/logger";
import appPromise from "./app";

appPromise &&
  appPromise.then((app) => {
    const myApp = app as Application;
    myApp.listen(config.port, () => {
      Logger.info(`
  ⚡️---------------------------------------------------⚡️
  ⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
  ⚡️|	    Ready now on port: ${config.port}           |⚡️
  ⚡️---------------------------------------------------⚡️
  `);
    });
  });
