import express from "express";
import dotenv from 'dotenv';
import routes from "./routes.js";

const app = express();

dotenv.config();

app.use(routes)

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
