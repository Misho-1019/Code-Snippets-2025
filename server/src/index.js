import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import routes from "./routes.js";
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri)

    console.log('DB connected successfully!');
} catch (err) {
    console.log('Cannot connect!');
    console.error(err.message);
}

app.use(express.json())
app.use(cookieParser())

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many request from this IP, please try again!',
})

app.use(apiLimiter)
app.use(authMiddleware)
app.use(routes)

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
