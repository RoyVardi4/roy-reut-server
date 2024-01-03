import mongoose, { Schema, Document } from "mongoose";

interface IRecipe extends Document {
  title: string;
  instructions: string;
  publisherUserId?: string;
  readyInMinutes?: number;
  imagePath?: string;
}

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
  },
  publisherUserId: {
    type: String,
  },
  readyInMinutes: {
    type: Number,
  },
  image_path: {
    type: String,
  },
});

const RecipeModel = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default RecipeModel;
