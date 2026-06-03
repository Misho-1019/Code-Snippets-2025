import { Schema, Types, model, Document } from "mongoose";

export interface IComment extends Document {
    text: string;
    creator: Types.ObjectId;
    snippetId: Types.ObjectId;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    text: {
        type: String,
        required: [true, 'Comment text is required!'],
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required!'],
    },
    snippetId: {
        type: Schema.Types.ObjectId,
        ref: 'Snippet',
        required: [true, 'Snippet ID is required!'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Comment = model<IComment>('Comment', commentSchema)

export default Comment
