import { Router, Request, Response, NextFunction } from "express";
import { register, login, logout } from "../handlers/auth";
import { authenticate } from "../middlewares/authMiddleware";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post('/register', register)

  route.post('/login', login)

  route.post('/logout', authenticate, logout)
};
