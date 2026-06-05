import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        minLength: 2,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        minLength: 6,
    },
    password: {
        type: String,
        minLength: 6,
        trim: true,
    },
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

const User = model<IUser>('User', userSchema)

export default User
