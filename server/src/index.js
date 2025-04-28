import express from "express";
import dotenv from 'dotenv';
import routes from "./routes";

const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send('It works!')
})

app.use(routes)

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}...`))
