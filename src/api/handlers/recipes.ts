import axios from "axios";
import { Request, Response } from "express";
import RecipeModel from "../../entities/recipe";
import path from "path";

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
    const results = await RecipeModel.find().where({
      $or: [
        { publisherUserId: req["user"]?._id },
        { publisherUserId: null },
        { publisherUserId: undefined },
        { publisherUserId: { $exists: false } },
      ],
    });
    return res.json(results);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getMyRecipes = async (req: Request, res: Response) => {
  try {
    const results = await RecipeModel.find().where({
      publisherUserId: req["user"]?._id,
    });
    return res.json(results);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getMyRecipesImages = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
  
    // Validate and sanitize the filename before constructing the path
    if (/^[a-zA-Z0-9-.]+$/.test(filename) && filename) {
      const imagePath = path.join(path.resolve(), "/uploads/", filename);
      return res.sendFile(imagePath);
    } else {
      return res.status(400).send("Invalid filename");
    }
  } catch(e) {
    return res.status(500).send(e.message)
  }
};

const createNewRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = new RecipeModel({
      title: "second new recipe!",
      instructions: "very important instructions...",
      publisherUserId: "vardiroy4@gmail.com",
    });

    const newRecipe = await recipe.save();
    return res.json(newRecipe);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export {
  getRecipeInfomationById,
  getRecipesByComplextQuery,
  createNewRecipe,
  getAllUsersRecipes,
  getMyRecipes,
  getMyRecipesImages,
};
