import express from "express";
import config from "./config/index";
import Logger from "./lib/logger";
import * as libs from "./lib";
import mongoose from "mongoose";

async function startServer() {
  const app: express.Application = express();
  await libs.default({ serverApp: app });
  mongoose.connect(process.env.DATABASE_URL)
  .then(() => 
  app &&
  app.listen(config.port, () => {
    Logger.info(`
                /|");
 _______________)|..");
<'______________<(,_|)");
          .((()))| ))");
          (======)| '\\");
         ((( \"_\"()|_ \\");
        '()))(_)/_/ ' )");
        .--/_\\ /(  /./");
       /'._.--\\ .-(_/");
      / / )\\___:___)");
     ( -.'.._  |  /");
      \\  \\_\\ ( | )");
       '. /\\)_(_)|");
         '-|  XX |");
          %%%%%%%%");
         / %%%%%%%\\");
        ( /.-'%%%. \\");
       /(.'     \\ :|");
      / ,|       ) )");
    _|___)      (__|_.		   ⚡️-------------------------------------------------------⚡️
    )___/       )___(			      ⚡️|	Running Node Server for ${process.env.NODE_ENV}	|⚡️
     |x/      mrf\\ >			      
     |x)         / '.			      ⚡️|	    Ready now on port: ${config.port}           |⚡️
     |x\\       _(____''.__                  
    --\\__|--"); 

  `)}))
  .catch((error) => console.log(error.message));
  

  // const db = mongoose.connection
  // db.on('error', error => {console.log(error)})
  // db.on('open', () => {console.log('cocnnected to mongo')})
}

startServer();
