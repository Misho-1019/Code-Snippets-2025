import { Schema, Types, model, Document } from "mongoose";

export interface ISnippet extends Document {
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
    visibility: 'private' | 'public';
    creator: Types.ObjectId;
    createdAt: Date;
    likes: Types.ObjectId[];
}

const snippetSchema = new Schema<ISnippet>({
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required!']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],
    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'private',
    },
})

snippetSchema.index({ title: 'text', description: 'text' }, { language_override: 'lang' })
snippetSchema.index({ tags: 1 })

const Snippet = model<ISnippet>('Snippet', snippetSchema);

export default Snippet
