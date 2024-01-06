import mongoose, { Schema, Document } from "mongoose";

interface IRecipe extends Document {
  title: string;
  instructions: string;
  publisherUserId?: string;
  readyInMinutes?: number;
  file?: string;
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
  file: {
    type: String
  },
});

const RecipeModel = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default RecipeModel;
