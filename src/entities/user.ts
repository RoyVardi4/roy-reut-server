import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
    password: string;
    email: string;
    tokens: String[];
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: {
        type: [String]
    }
})

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
