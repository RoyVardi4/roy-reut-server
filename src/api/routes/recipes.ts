import { Router } from "express";
import {
  createNewRecipe,
  getRecipeInfomationById,
  getRecipesByComplextQuery,
  getAllUsersRecipes,
  getMyRecipes,
  getMyRecipesImages
} from "../handlers/recipes";

const route = Router();

export default (app: Router) => {
  app.use("/recipes", route);

  route.get("/complexSearch", getRecipesByComplextQuery);
  route.get("/:id/information", getRecipeInfomationById);
  route.get("/users", getAllUsersRecipes);
  route.get("/my", getMyRecipes);
  route.get("/img/:filename", getMyRecipesImages);

  route.post("/", createNewRecipe);
};
