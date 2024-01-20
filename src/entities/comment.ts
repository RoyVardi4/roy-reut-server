import mongoose, { Schema, Document } from 'mongoose'

interface IComment extends Document {
    desc: string;
    author: string
}

const commentSchema = new Schema({
    desc: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
