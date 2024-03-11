import express, { Application } from "express";
import config from "./config/index";
import Logger from "./lib/logger";
import appPromise from "./app";
import https from 'https';
import fs from 'fs';
import http from "http";

appPromise &&
  appPromise.then((app) => {
    const myApp = app as Application;
    
    if(process.env.NODE_ENV !== 'production') {
      http.createServer(myApp).listen(config.port, () => {
        Logger.info(`
          ⚡️---------------------------------------------------⚡️
          ⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
          ⚡️|	    Ready now on port: ${config.port}           |⚡️
          ⚡️---------------------------------------------------⚡️
        `);
      })
    } else {
      const options = {
        key: fs.readFileSync('./client-key.pem'),
        cert: fs.readFileSync('./client-cert.pem'),
      }
      
      https.createServer(options, myApp).listen(config.port, () => {
        Logger.info(`
          ⚡️---------------------------------------------------⚡️
          ⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
          ⚡️|	    Ready now on port: ${config.port}           |⚡️
          ⚡️---------------------------------------------------⚡️
        `);
      })
    }


  //   myApp.listen(config.port, () => {
  //     Logger.info(`
  // ⚡️---------------------------------------------------⚡️
  // ⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
  // ⚡️|	    Ready now on port: ${config.port}           |⚡️
  // ⚡️---------------------------------------------------⚡️
  // `);
  //   });
  });
