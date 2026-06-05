import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

const dummyHash = bcrypt.hashSync('dummy-placeholder', 10)

export default {
    async register(authData: AuthData): Promise<AuthResult> {
        try {
            const user = await User.create(authData)

            const payload = {
                id: user.id,
                email: user.email,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2h' })

            return {
                token,
                _id: user._id as string,
                email: user.email,
                username: user.username,
            };
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'code' in err && (err as any).code === 11000) {
                throw new Error('User already exists!')
            }
            throw err
        }
    },
    async login(email: string, password: string): Promise<AuthResult> {
        const user = await User.findOne({ email })

        const isValid = await bcrypt.compare(password, user ? user.password as string : dummyHash)

        if (!user || !isValid) {
            throw new Error('Invalid email or password!')
        }

        const payload = {
            id: user.id,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2h' })
        
        return {
            token,
            _id: user._id as string,
            email: user.email,
            username: user.username,
        };
    }
}
