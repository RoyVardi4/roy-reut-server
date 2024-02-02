import mongoose, { Schema, Document } from "mongoose";

interface IRecipe extends Document {
  title: string;
  instructions: string;
  author?: Schema.Types.ObjectId;
  comments?: [Schema.Types.ObjectId];
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
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment'
  },
  readyInMinutes: {
    type: Number,
  },
  file: {
    type: String,
  },
});

const RecipeModel = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default RecipeModel;
