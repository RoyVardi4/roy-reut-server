import { Router } from "express";
import {
  createNewRecipe,
  getRecipeInfomationById,
  getRecipesByComplextQuery,
  getAllUsersRecipes,
  getMyRecipesImages,
  uploadImageToRecipe,
  postComment,
  getRecipeComments,
  deleteRecipe,
} from "../handlers/recipes";
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

    const recipeId = req.params.recipeId;
    if (!recipeId || !/^[a-zA-Z0-9-.]+$/.test(recipeId))
      return cb(Error("invalid file name"), null);

    cb(null, `${req.params.recipeId}.${fileExtention}`);
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
   *     name: Recipe
   *     description: Recipe API
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     Recipe:
   *       type: object
   *       required:
   *         - title
   *         - instructions
   *         - author
   *       properties:
   *         title:
   *           type: string
   *           description: recipe title
   *         instructions:
   *           type: string
   *           description: how to make the dish
   *         author:
   *           type: Object
   *           description: who post the recipe
   *       example:
   *           title: 'fish and chips'
   *           author: 'ObjectId(65abdd4fea2d8c6b1a5f23c4)'
   *           instructions: 'cook the fish in the oven for 10 minutes and then throw the potatos to the oil'
   */

  app.use("/recipes", route);

  /**
   * @swagger
   * /api/recipes/complexSearch:
   *   get:
   *     summary: Returns recipes from external api according to query string
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: 10 recipes
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.get("/complexSearch", authenticate, getRecipesByComplextQuery);

  /**
   * @swagger
   * /api/recipes/:id/information:
   *   get:
   *     summary: Returns recipe information by id
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: recipe information
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.get("/:id/information", authenticate, getRecipeInfomationById);

  /**
   * @swagger
   * /api/recipes/users:
   *   get:
   *     summary: Returns app users recipes
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: users recipe information
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.get("/users", authenticate, getAllUsersRecipes);

  /**
   * @swagger
   * /api/recipes/users/:recipeId:
   *   get:
   *     summary: Gets recipe's comments by recipe id
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: users recipe's comments
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.get("/users/:recipeId", authenticate, getRecipeComments);

  /**
   * @swagger
   * /api/recipes/img/:recipeId:
   *   get:
   *     summary: Gets recipe's photo by id
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: recipe's picture
   *       '500':
   *         description: internal server error
   */
  route.get("/img/:recipeId", getMyRecipesImages);

  /**
   * @swagger
   * /api/recipes/
   *   post:
   *     summary: creates new Recipe
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: created recipe
   *       '400':
   *         description: wrong input
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.post("/", authenticate, createNewRecipe);

  /**
   * @swagger
   * /api/recipes/users/comments
   *   post:
   *     summary: creates new comment on recipe
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: created recipe
   *       '400':
   *         description: wrong input
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.post("/users/comments", authenticate, postComment);

  /**
   * @swagger
   * /api/recipes/img/:recipeId
   *   post:
   *     summary: attach photo to recipe
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: updated recipe
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.post(
    "/img/:recipeId",
    authenticate,
    upload.single("recipeImage"),
    uploadImageToRecipe
  );

    /**
   * @swagger
   * /api/recipes/:recipeId
   *   delete:
   *     summary: deletes recipe
   *     tags: [Recipe]
   *     responses:
   *       '200':
   *         description: deleted recipe
   *       '403':
   *         description: access denied - invalid request
   *       '500':
   *         description: internal server error
   */
  route.delete("/:recipeId", authenticate, deleteRecipe);
};
