import { Router as RouterExpress } from "express";

import user from "./routes/user";
import recipes from "./routes/recipes";
import auth from "./routes/auth";
// guaranteed to get dependencies
export default () => {
  const app = RouterExpress();
  auth(app);
  user(app);
  recipes(app);
  return app;
};
