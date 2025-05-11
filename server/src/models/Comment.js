import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required!'],
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required!'],
    },
    snippetId: {
        type: Types.ObjectId,
        ref: 'Snippet',
        required: [true, 'Snippet ID is required!'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Comment = model('Comment', commentSchema)

export default Comment;