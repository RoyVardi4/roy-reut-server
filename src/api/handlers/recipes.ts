import axios from "axios";
import { Request, Response } from "express";
import path from "path";
import RecipeModel from "../../entities/recipe";
import { ObjectId } from "mongodb";

const RECIPES_API =
  process.env.EXTERNAL_API || "https://api.spoonacular.com/recipes";
const API_KEY =
  process.env.EXTERNAL_API_KEY || "ee8b40f50b414ed5b735bb593bc5c8d5";

const getRecipeInfomationById = async (req: Request, res: Response) => {
  const options = {
    method: "GET",
    url: `${RECIPES_API}/${req.params.id}/information`,
    headers: {
      "x-api-key": API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getRecipesByComplextQuery = async (req: Request, res: Response) => {
  const options = {
    method: "GET",
    url: `${RECIPES_API}/complexSearch`,
    params: {
      query: req.query.queryString,
    },
    headers: {
      "x-api-key": API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getAllUsersRecipes = async (req: Request, res: Response) => {
  try {
    const results = await RecipeModel.find();
    return res.json(results);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getMyRecipesImages = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;

    const recipe = await RecipeModel.findById(new ObjectId(recipeId));

    const imagePath = path.join(path.resolve(), "/uploads/", recipe.file);
    return res.sendFile(imagePath);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const createNewRecipe = async (req: Request, res: Response) => {
  const { _id, title, instructions, publisherUserId } = req.body.recipe;
  try {
    // update recipe
    if (_id) {
      const updatedRecipe = await RecipeModel.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          title: title,
          instructions: instructions,
        }
      );
      return res.json(updatedRecipe);
    } else {
      // create new recipe
      const recipe = new RecipeModel({
        title: title,
        instructions: instructions,
        publisherUserId: publisherUserId,
      });

      const newRecipe = await recipe.save();
      return res.json(newRecipe);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const uploadImageToRecipe = async (req: Request, res: Response) => {
  try {
    const idToupdate = new ObjectId(req.params.recipeId);
    const updatedRecipe = await RecipeModel.findOneAndUpdate(
      { _id: idToupdate },
      { file: req.file.filename }
    );

    return res.json(updatedRecipe);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export {
  getRecipeInfomationById,
  getRecipesByComplextQuery,
  createNewRecipe,
  getAllUsersRecipes,
  getMyRecipesImages,
  uploadImageToRecipe,
};
