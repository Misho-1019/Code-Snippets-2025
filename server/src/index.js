import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send('It works!')
})

const PORT = 3030;

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}...`))
