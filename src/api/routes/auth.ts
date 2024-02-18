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

  /**
 * @swagger
 * /register:
 *   post:
 *     summary: Register new user to application 
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: returns the saved new user email
 *       '400':
 *         description: username is already 
 *       '500':
 *         description: unexpected server error
 */
  route.post("/register", register);
  
  /**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in the requested user 
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: returns valid refresh and access token
 *       '400':
 *         description: input is incorrect
 *       '500':
 *         description: unexpected server error
 */
  route.post("/login", login);

  /**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logs out the connected user 
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: clears the refresh and access token
 */
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
 *       '403':
 *         description: access denied - invalid request
 */
  route.get("/refreshToken", refreshToken);
};
