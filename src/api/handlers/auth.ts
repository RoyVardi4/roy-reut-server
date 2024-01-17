import UserModel from "../../entities/user";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response, next: NextFunction) => {
  console.log("register");
  const {email, password} = req.body.user

  if (!email || !password) {
    return sendError(res);
  }

  try {
    const exists = await UserModel.exists({ email: email });

    if (exists) return sendError(res, "user already registered");

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      email: email,
      password: encryptedPassword,
    });

    const newUser = await user.save();
    res.status(200).send(newUser.email);
  } catch (err) {
    return sendError(
      res,
      err instanceof Error
        ? "failed registration: " + err.message
        : "failed registration"
    );
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  console.log("login");
  const {email, password} = req.body.user

  if (!email || !password) {
    return sendError(res, "one of the fields is missing");
  }

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) return sendError(res, "user not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, "password is wrong");

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    res
        .status(200)
        .send({
            'accessToken':accessToken,
            'refreshToken':refreshToken
        })
  } catch (err) {
    return sendError(
      res,
      err instanceof Error ? "failed login: " + err.message : "failed login"
    );
  }
};

const sendError = (res: Response, message?: string) => {
  return res.status(400).send({
    status: "fail",
    message: message ? message : "unknown error",
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  console.log("logout");
  res
  .status(200)
  .send({
      'accessToken':'',
      'refreshToken':''
  })
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('refresh')
  const refreshToken = req.headers.refreshtoken as string;

  if (!refreshToken)
    return res.status(401).send("Access Denied. No token provided.");

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, userInfo) => {
      if (err) return res.status(403).send(err.message);

      const userId = (userInfo as jwt.JwtPayload)._id;

      try {
        const user = await UserModel.findById(userId);

        if (!user) return res.status(403).send("Invalid request");

        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
        );

        res
        .status(200)
        .send({
            'accessToken':accessToken,
            'refreshToken':refreshToken
        })
      } catch (err) {
        return sendError(
          res,
          err instanceof Error
            ? "refresh error: " + err.message
            : "refresh error"
        );
      }
    }
  );
};

export { register, login, logout, refreshToken };
