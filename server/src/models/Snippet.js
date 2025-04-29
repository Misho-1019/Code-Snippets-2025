import { Schema, Types, model } from "mongoose";

const snippetSchema = new Schema({
    title: String,
    description: String,
    code: String,
    language: String,
    creator: {
        type: Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Snippet = model('Snippet', snippetSchema);

export default Snippet