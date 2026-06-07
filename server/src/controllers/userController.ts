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

        const snippets = await Snippet.find({ creator: user._id, visibility: 'public' })
            .sort({ createdAt: -1 })

        res.json({
            _id: user._id,
            username: user.username,
            joinedAt: user.createdAt,
            publicSnippets: snippets.length,
            snippets,
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' })
    }
})

export default userController;
