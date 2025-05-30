import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || 'BASICSECRET';

export default {
    async register(authData) {
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
            _id: user._id,
            email: user.email,
            username: user.username,
        };
    },
    async login(email, password) {
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('Invalid email or password!')
        }

        const isValid = await bcrypt.compare(password, user.password)

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
            _id: user._id,
            email: user.email,
            username: user.username,
        };
    }
}