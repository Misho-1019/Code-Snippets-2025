import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

import routes from "./routes.js";
import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';

const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI']
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required env variable: ${envVar}`)
        process.exit(1)
    }
}

const app = express();

app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('dev'))

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}))

try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri)

    console.log('DB connected successfully!');
} catch (err) {
    console.log('Cannot connect!');
    console.error(err instanceof Error ? err.message : err);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(express.json())
app.use(cookieParser())

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many auth attempts from this IP, please try again!',
})

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many request from this IP, please try again!',
})

const mutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many mutations from this IP, please try again!',
    skip: (req) => req.method === 'GET',
})

app.use('/auth', authLimiter)
app.use('/snippets', mutationLimiter)
app.use(generalLimiter)
app.use(authMiddleware)
app.use(routes)
app.use(errorHandler)

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
