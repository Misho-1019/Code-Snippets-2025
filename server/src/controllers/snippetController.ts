import { Router, Request, Response } from "express";
import snippetService from "../services/snippetService.js";
import commentService from "../services/commentService.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import likesService from "../services/likesService.js";
import {
    createSnippetSchema,
    updateSnippetSchema,
    createCommentSchema,
    paginationSchema,
    validate,
    validateQuery
} from "../validators/snippetValidator.js";

const snippetController = Router();

/**
 * @openapi
 * /snippets:
 *   get:
 *     tags: [Snippets]
 *     summary: Get all snippets with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: language
 *         schema: { type: string }
 *       - in: query
 *         name: description
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of snippets
 *       500:
 *         description: Server error
 */
snippetController.get('/', validateQuery(paginationSchema), async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { search, language } = req.query as Record<string, string | undefined>

    const filter: Record<string, unknown> = {};

    if (search) filter.$text = { $search: search };
    if (language) filter.language = language;

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

/**
 * @openapi
 * /snippets/latest:
 *   get:
 *     tags: [Snippets]
 *     summary: Get the latest snippets
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 3 }
 *     responses:
 *       200:
 *         description: List of latest snippets
 *       404:
 *         description: No snippets found
 */
snippetController.get('/latest', async (req: Request, res: Response) => {
    const { sortBy = 'createdAt', order = 'desc', pageSize = 3 } = req.query as Record<string, string>;

    try {
        const snippets = await snippetService.getLatest({ sortBy, order, pageSize: Number(pageSize) })

        if (!snippets || snippets.length === 0) {
            res.status(404).json({ error: 'No snippets found!' })
            return
        }

        res.status(200).json(snippets)
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        res.status(500).json({ error: 'Server error while fetching latest snippets!' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}:
 *   get:
 *     tags: [Snippets]
 *     summary: Get a single snippet by ID
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Snippet data
 *       404:
 *         description: Snippet not found
 */
snippetController.get('/:snippetId', async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string;

    try {
        const snippet = await snippetService.getOne(snippetId)

        if (!snippet) {
            res.status(404).json({ error: 'Snippet not found!' })
            return
        }

        res.status(200).json(snippet)
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        res.status(500).json({ error: 'Failed to fetch snippet!' })
    }
})

/**
 * @openapi
 * /snippets/create:
 *   post:
 *     tags: [Snippets]
 *     summary: Create a new snippet
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, code, language]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               code: { type: string }
 *               language: { type: string }
 *     responses:
 *       201:
 *         description: Snippet created
 *       400:
 *         description: Validation error
 */
snippetController.post('/create', isAuth, validate(createSnippetSchema), async (req: Request, res: Response) => {
    const snippetData = req.body;
    const creatorId = req.user?.id;

    try {
        const newSnippet = await snippetService.createSnippet(snippetData, creatorId!)

        res.status(201).json(newSnippet)
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to create snippet' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}:
 *   put:
 *     tags: [Snippets]
 *     summary: Update a snippet (owner only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               code: { type: string }
 *               language: { type: string }
 *     responses:
 *       200:
 *         description: Snippet updated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Snippet not found
 */
snippetController.put('/:snippetId', isAuth, validate(updateSnippetSchema), async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string;
    const snippetData = req.body;
    const userId = req.user!.id;

    try {
        const snippet = await snippetService.getOne(snippetId)

        if (!snippet) {
            res.status(404).json({ error: 'Snippet not found!' })
            return
        }

        if (snippet.creator.toString() !== userId) {
            res.status(403).json({ error: 'Unauthorized!' })
            return
        }

        const updatedSnippet = await snippetService.updateSnippet(snippetData, snippetId)

        res.status(200).json(updatedSnippet)
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to update snippet' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}:
 *   delete:
 *     tags: [Snippets]
 *     summary: Delete a snippet (owner only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Snippet deleted
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Snippet not found
 */
snippetController.delete('/:snippetId', isAuth, async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string;
    const userId = req.user?.id;

    try {
        const snippet = await snippetService.getOne(snippetId)

        if (!snippet) {
            res.status(404).json({ error: 'Snippet not found!' })
            return
        }

        if (snippet.creator.toString() !== userId) {
            res.status(403).json({ error: 'Unauthorized!' })
            return
        }

        await Promise.all([
            commentService.deleteBySnippetId(snippetId),
            snippetService.deleteSnippet(snippetId),
        ])

        res.status(200).json({ message: 'Snippet deleted successfully!' });
    } catch (err) {
        res.status(404).json({ error: err instanceof Error ? err.message : 'Failed to delete snippet' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments for a snippet
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of comments
 */
snippetController.get('/:snippetId/comments', async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string;

    try {
        const comments = await commentService.getAllComments(snippetId);

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch comments' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a snippet
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Validation error
 */
snippetController.post('/:snippetId/comments', isAuth, validate(createCommentSchema), async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string;
    const { text } = req.body;

    try {
        const newComment = await commentService.createComment(snippetId, { text, creator: req.user!.id })

        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create comment' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}/comments/{commentId}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
snippetController.delete('/:snippetId/comments/:commentId', isAuth, async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;

    try {
        const commentDeleted = await commentService.deleteComment(commentId)

        if (!commentDeleted) {
            res.status(404).json({ message: 'Comment not found!' })
            return
        }

        res.status(200).json({ message: 'Comment deleted successfully!' })
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to delete comment' })
    }
})

/**
 * @openapi
 * /snippets/{snippetId}/likes:
 *   post:
 *     tags: [Likes]
 *     summary: Toggle like/unlike on a snippet
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: snippetId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Like toggled
 *       500:
 *         description: Server error
 */
snippetController.post('/:snippetId/likes', isAuth, async (req: Request, res: Response) => {
    const snippetId = req.params.snippetId as string
    const userId = req.user?.id

    try {
        const result = await likesService.toggleLike(snippetId, userId!)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to toggle like' })
    }
})

export default snippetController;
