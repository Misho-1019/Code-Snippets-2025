import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export interface AuthResult {
    token: string;
    _id: string;
    email: string;
    username: string;
}

export interface AuthData {
    username: string;
    email: string;
    password: string;
}

export default {
    async register(authData: AuthData): Promise<AuthResult> {
        const userCount = await User.countDocuments({ email: authData.email })

        if (userCount > 0) {
            throw new Error('User already exists!')
        }

        const user = await User.create(authData)

        const payload = {
            id: user.id,
            email: user.email,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

        return {
            token,
            _id: user._id as string,
            email: user.email,
            username: user.username,
        };
    },
    async login(email: string, password: string): Promise<AuthResult> {
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('Invalid email or password!')
        }

        const isValid = await bcrypt.compare(password, user.password as string)

        if (!isValid) {
            throw new Error('Invalid email or password!')
        }

        const payload = {
            id: user.id,
            email: user.email,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })
        
        return {
            token,
            _id: user._id as string,
            email: user.email,
            username: user.username,
        };
    }
}
