import { Router } from "express";
import {
  createNewRecipe,
  getRecipeInfomationById,
  getRecipesByComplextQuery,
  getAllUsersRecipes,
  getMyRecipesImages,
  uploadImageToRecipe,
} from "../handlers/recipes";
import multer from "multer";

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

  route.get("/complexSearch", getRecipesByComplextQuery);
  route.get("/:id/information", getRecipeInfomationById);
  route.get("/users", getAllUsersRecipes);
  route.get("/img/:recipeId", getMyRecipesImages);

  route.post("/", createNewRecipe);
  route.post(
    "/img/:recipeId",
    upload.single("recipeImage"),
    uploadImageToRecipe
  );
};
