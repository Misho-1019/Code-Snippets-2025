import { Router } from "express";
import snippetService from "../services/snippetService.js";
import commentService from "../services/commentService.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { body, validationResult } from "express-validator";

const snippetController = Router();

snippetController.get('/', async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { title, description, language } = req.query

    const filter = {};

    if (title) filter.title;
    if (description) filter.description;
    if (language) filter.language;

    try {
        const [snippets, totalCount] = await Promise.all([
            snippetService.getAll(page, limit, filter),
            snippetService.getTotalCount(filter)
        ])

        res.status(200).json({
            snippets,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalSnippets: totalCount,
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch snippets!' })
    }
})

snippetController.get('/latest', async (req, res) => {
    const { sortBy = 'createdAt', order = 'desc', pageSize = 3 } = req.query;

    try {
        const snippets = await snippetService.getLatest({ sortBy, order, pageSize })

        if (!snippets || snippets.length === 0) {
            return res.status(404).json({ error: 'No snippets found!' })
        }

        res.status(200).json(snippets)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching latest snippets!' })
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

snippetController.post('/create', isAuth, [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
    body('code').notEmpty().withMessage('Code is required').isString().withMessage('Code must be a string'),
    body('language').notEmpty().withMessage('Language is required').isString().withMessage('Language must be a string')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

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

snippetController.put('/:snippetId', isAuth, [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('code').optional().isString().withMessage('Code must be a string'),
    body('language').optional().isString().withMessage('Language must be a string'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
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

snippetController.get('/:snippetId/comments', async (req, res) => {
    const snippetId = req.params.snippetId;

    try {
        const comments = await commentService.getAllComments(snippetId);

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

snippetController.post('/:snippetId/comments', isAuth, async (req, res) => {
    const snippetId = req.params.snippetId;
    const { text, creator } = req.body;

    if (!text || !creator) {
        return res.status(404).json({message: 'Text and creator are required to post a comment!'})
    }

    try {
        const newComment = await commentService.createComment(snippetId, { text, creator })

        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default snippetController;