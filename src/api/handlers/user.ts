import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import UserModel from "../../entities/user";
import path from "path";

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = req["user"];
    const userModel = await UserModel.findById(new ObjectId(user._id));
    return res.json(userModel);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUserPhoto = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.userEmail;
    const userResult = await UserModel.findOne({ email: userEmail });
    const imagePath = path.join(path.resolve(), "/uploads/", userResult.file);
    return res.sendFile(imagePath);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const uploadImage = async (req: Request, res: Response) => {
  try {
    const userEmail = req.params.userEmail;
    const updatedRecipe = await UserModel.findOne(
      { email: userEmail }
    );
    updatedRecipe.file = req.file.filename
    updatedRecipe.save()

    return res.json(updatedRecipe);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export { getUserInfo, getUserPhoto, uploadImage };
