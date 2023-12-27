import { Router as RouterExpress } from "express";

import config from "../config";
// import auth from "./routes/auth";
import sample from './routes/sample';
// guaranteed to get dependencies
export default () => {
  const app = RouterExpress();
    // auth(app);
  // user(app);
  sample(app);
  return app;
};
