import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { mongoSanitize } from "./middlewares/mongoSanitize.js";
import morgan from "morgan";

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

import routes from "./routes.js";
import { authMiddleware } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { csrfProtection } from './middlewares/csrfMiddleware.js';

const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI']
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required env variable: ${envVar}`)
        process.exit(1)
    }
}

const app = express();

app.use(helmet())
app.use(morgan('dev'))

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize)

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'Too many auth attempts from this IP, please try again!' },
})

const mutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many mutations from this IP, please try again!' },
    skip: (req) => req.method === 'GET',
})

app.use('/api/auth', authLimiter)
app.use('/api/snippets', mutationLimiter)
app.use(csrfProtection)
app.use(authMiddleware)
app.use('/api', routes)
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
app.use(errorHandler)

const port = process.env.PORT || 3030;

async function start() {
    try {
        const uri = process.env.MONGO_URI as string;
        await mongoose.connect(uri)
        console.log('DB connected successfully!');
    } catch (err) {
        console.error('Cannot connect to DB!');
        console.error(err instanceof Error ? err.message : err);
        process.exit(1)
    }

    mongoose.connection.on('error', (err) => {
        console.error('DB connection error:', err.message)
    })
    mongoose.connection.on('disconnected', () => {
        console.warn('DB disconnected — attempting reconnect...')
    })

    app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
}

start()
