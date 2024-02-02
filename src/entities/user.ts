import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
    password: string;
    email: string;
    status: string;
    file: string;
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
    status: {
        type: String
    },
    file: {
        type: String
    }
})

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
