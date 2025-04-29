import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import routes from "./routes.js";

const app = express();

try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri)

    console.log('DB connected successfully!');
} catch (err) {
    console.log('Cannot connect!');
    console.error(err.message);
}

app.use(cookieParser())
app.use(routes)

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
