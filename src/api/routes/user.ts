import { Router } from "express";
import {
  getUserInfo,
  getUserPhoto,
  uploadImage,
  editUser,
} from "../handlers/user";
import multer from "multer";
import { authenticate } from "../middlewares/authMiddleware";

const route = Router();

// multer config ==> file handler
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const [fileType, fileExtention] = file.mimetype.split("/");

    if (fileType !== "image")
      return cb(Error("file ext must be an image type"), null);

    const userEmail = req.params.userEmail;
    if (!userEmail || !/^[a-zA-Z0-9-.@]+$/.test(userEmail))
      return cb(Error("invalid file name"), null);

    cb(null, `${userEmail}.${fileExtention}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export default (app: Router) => {
  /**
   * @swagger
   *   tags:
   *     name: User
   *     description: The User API
   */

  app.use("/users", route);

  /**
   * @swagger
   * /api/users/myInfo:
   *   get:
   *     summary: Returns user info by id
   *     tags: [User]
   *     responses:
   *       '200':
   *         description: user info
   *       '401':
   *         description: access denied
   *       '500':
   *         description: internal server error
   */
  route.get("/myInfo", authenticate, getUserInfo);

  /**
   * @swagger
   * /api/users/myPhoto/:userEmail:
   *   get:
   *     summary: Returns user photo
   *     tags: [User]
   *     responses:
   *       '200':
   *         description: user photo
   *       '500':
   *         description: internal server error
   */
  route.get("/myPhoto/:userEmail", getUserPhoto);

  /**
   * @swagger
   * /api/users/myPhoto/:userEmail:
   *   post:
   *     summary: attach photo to user
   *     tags: [User]
   *     responses:
   *       '200':
   *         description: save new user photo
   *       '500':
   *         description: internal server error
   */
  route.post(
    "/myPhoto/:userEmail",
    authenticate,
    upload.single("profilePicture"),
    uploadImage
  );

  /**
   * @swagger
   * /api/users/myInfo:
   *   post:
   *     summary: saves user data to db
   *     tags: [User]
   *     responses:
   *       '200':
   *         description: user saved successfully
   *       '401':
   *         description: access denied
   *       '500':
   *         description: internal server error
   */
  route.post("/myInfo", authenticate, editUser);
};
