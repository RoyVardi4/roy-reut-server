import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('auth middleware')
  const accessToken = req.headers.authorization;

  if (!accessToken)
    return res.status(401).send("Access Denied. No token provided.");

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req["user"] = user;
    next();
  } catch (error) {
    return res.status(401).send("Access Denied. Invalid token");
  }
};

export { authenticate };
