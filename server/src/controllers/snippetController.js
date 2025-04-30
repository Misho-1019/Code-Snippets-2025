import { Router } from "express";
import snippetService from "../services/snippetService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

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

        if (!snippet) {
            res.status(404).json({ error: 'Snippet not found!' })
        }

        res.status(200).json(snippet)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch snippet!' })
    }
})

snippetController.post('/', isAuth, async (req, res) => {
    const snippetData = req.body;
    const creatorId = req.user?.id;

    try {
        const newSnippet = await snippetService.createSnippet(snippetData, creatorId)

        res.status(201).json(newSnippet)
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message })
    }
})

snippetController.put('/:snippetId', isAuth, async (req, res) => {
    const snippetId = req.params.snippetId;
    const snippetData = req.body;
    const userId = req.user.id;

    try {
        const snippet = await snippetService.getOne(snippetId)

        if (!snippet) {
            return res.status(404).json({ error: 'Snippet not found!' })
        }

        if (snippet.creator.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized!' })
        }

        const updatedSnippet = await snippetService.updateSnippet(snippetData, snippetId)

        res.status(200).json(updatedSnippet)
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message })
    }
})

snippetController.delete('/:snippetId', isAuth, async (req, res) => {
    const snippetId = req.params.snippetId;
    const userId = req.user?.id;

    try {
        const snippet = await snippetService.getOne(snippetId)

        if (snippet.creator.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized!' })
        }

        await snippetService.deleteSnippet(snippetId)

        res.status(200).json({ message: 'Snippet deleted successfully!' });
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
})

export default snippetController;