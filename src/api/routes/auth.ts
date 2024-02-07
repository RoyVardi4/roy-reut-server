import { Router } from "express";
import { register, login, logout, refreshToken } from "../handlers/auth";
import { authenticate } from "../middlewares/authMiddleware";

const route = Router();


/**
* @swagger
*   tags:
*     name: Auth
*     description: The Authentication API
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*           email: 'bob@gmail.com'
*           password: '123456'
*/

export default (app: Router) => {
  
  app.use("/auth", route);

  route.post("/register", register);

  route.post("/login", login);

  route.post("/logout", authenticate, logout);

  /**
 * @swagger
 * /refreshToken:
 *   get:
 *     summary: Returns a new access token
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: access permited
 *       '401':
 *         description: access denied
 */
  route.get("/refreshToken", refreshToken);
};
