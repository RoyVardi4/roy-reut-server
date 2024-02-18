import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import UserModel from "../../entities/user";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("auth middleware");
  const accessToken = req.headers.authorization;

  if (!accessToken)
    return res.status(401).send("Access Denied. No token provided.");

  try {
    // check wether its google or custom access token 
    if (accessToken.startsWith("ya29")) {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
      );

      // check if user is already saved in User table in DB
      // then select it and put it in req["user"]
      // else create a record for user and save it in User table in DB
      const user = await UserModel.findOne({
        email: googleResponse.data.email,
      });

      if (user) {
        req["user"] = { _id: user._id };
      } else {
        const user = new UserModel({
          email: googleResponse.data.email,
          password: "googleUserPassword",
        });

        const newUser = await user.save();
        req["user"] = { _id: newUser._id };
      }
    } else {
      const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req["user"] = user;
    }

    next();
  } catch (error) {
    return res.status(401).send("Access Denied. Invalid token");
  }
};

export { authenticate };
