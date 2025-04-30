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

