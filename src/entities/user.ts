import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
    password: string;
    email: string;
    // You can add more fields as needed
  }

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
