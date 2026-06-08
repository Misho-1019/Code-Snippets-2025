import { Router, Request, Response } from "express";
import User from "../models/User.js";
import Snippet from "../models/Snippet.js";

const userController = Router();

userController.get('/:username', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('username createdAt')
        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        const sortMap: Record<string, Record<string, 1 | -1>> = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            alpha: { title: 1 },
        }
        const sortBy = (req.query.sort as string) || 'newest'
        const sort = sortMap[sortBy] || { createdAt: -1 }

        const filterLang = (req.query.language as string) || ''

        const query: Record<string, unknown> = { creator: user._id, visibility: 'public' }
        if (filterLang) query.language = filterLang

        const snippets = await Snippet.find(query).sort(sort)

        const totalLikesAgg = await Snippet.aggregate([
            { $match: { creator: user._id, visibility: 'public' } },
            { $unwind: { path: '$likes', preserveNullAndEmptyArrays: false } },
            { $count: 'total' },
        ])

        const languageCounts = await Snippet.aggregate([
            { $match: { creator: user._id, visibility: 'public' } },
            { $group: { _id: '$language', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ])

        res.json({
            _id: user._id,
            username: user.username,
            joinedAt: user.createdAt,
            publicSnippets: snippets.length,
            totalLikes: totalLikesAgg[0]?.total || 0,
            topLanguage: languageCounts[0]?._id || null,
            languageCounts,
            snippets,
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' })
    }
})

export default userController;
