import { Schema, Types, model } from "mongoose";

const snippetSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    code: {
        type: String,
        required: [true, 'Code is required!'],
    },
    language: {
        type: String,
        required: [true, 'Language is required!'],
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required!']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Snippet = model('Snippet', snippetSchema);

export default Snippet