import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { refreshToken } from "../handlers/auth";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization;
  const refreshTokenr = req.headers.refreshToken;

  if (!accessToken && !refreshTokenr)
    return res.sendStatus(401).send("Access Denied. No token provided.");

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req["user"] = user;
    next();
  } catch (error) {
    if (!refreshTokenr) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      refreshToken(req, res, next)
    } catch (error) {
      return res.status(400).send("Invalid Token.");
    }
  }
};

export { authenticate };
