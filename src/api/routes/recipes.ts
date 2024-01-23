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
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 8 * 1024 * 1024} });

export default (app: Router) => {
  app.use("/recipes", route);

  route.get("/complexSearch", authenticate, getRecipesByComplextQuery);
  route.get("/:id/information", authenticate, getRecipeInfomationById);
  route.get("/users", authenticate, getAllUsersRecipes);
  route.get("/users/:recipeId", authenticate, getRecipeComments);
  route.get("/img/:recipeId", getMyRecipesImages);

  route.post("/", authenticate, createNewRecipe);
  route.post("/users/comments", authenticate, postComment);
  route.post(
    "/img/:recipeId",
    authenticate,
    upload.single("recipeImage"),
    uploadImageToRecipe
    );
    
  route.delete("/:recipeId", authenticate, deleteRecipe);
  
};
