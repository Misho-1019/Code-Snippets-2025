import { Router } from "express";
import snippetService from "../services/snippetService.js";

const snippetController = Router();

snippetController.get('/', async (req, res) => {
    try {
        const snippets = await snippetService.getAll();

        res.status(200).json(snippets)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch snippets!' })
    }
})

snippetController.get('/:snippetId', async (req, res) => {
    const snippetId = req.params.snippetId;

    try {
        const snippet = await snippetService.getOne(snippetId)

        res.status(200).json(snippet)
    } catch (err) {
        console.error(err.message);
        res.status(404).json({ error: err.message })
    }
})
