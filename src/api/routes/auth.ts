import { Router, Request, Response, NextFunction } from "express";
import { register, login, logout } from "../handlers/auth";
import { authenticate } from "../middlewares/authMiddleware";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.get('/', authenticate, (req, res) => {
    res.status(200).json({
      "message" : "tut is here"
    });
  })

  route.post('/register', register)

  route.post('/login', login)

  route.post('/logout', authenticate, logout)
};
