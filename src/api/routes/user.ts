import { Router } from "express";
import { getUserInfo, getUserPhoto, uploadImage, editUser } from "../handlers/user";
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: user info
 *       '401':
 *         description: access denied
 *       '500':
 *         description: internal server error
 */
  route.get("/myInfo", authenticate, getUserInfo);
  route.get("/myPhoto/:userEmail", getUserPhoto);
  route.post(
    "/myPhoto/:userEmail",
    authenticate,
    upload.single("profilePicture"),
    uploadImage
  );
  route.post("/myInfo", authenticate, editUser);
};
