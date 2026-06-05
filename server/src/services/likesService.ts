import Snippet from "../models/Snippet.js"

export interface LikeResult {
    likesCount: number;
    likedByUser: boolean;
}

export default {
    async toggleLike(snippetId: string, userId: string): Promise<LikeResult> {
        const snippet = await Snippet.findById(snippetId)

        if (!snippet) {
            throw new Error('Snippet not found!')
        }

        const hasLiked = snippet.likes.some(id => id.toString() === userId)

        const update = hasLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } }

        const updated = await Snippet.findByIdAndUpdate(snippetId, update, { new: true })

        if (!updated) {
            throw new Error('Snippet not found!')
        }

        return {
            likesCount: updated.likes.length,
            likedByUser: !hasLiked,
        }
    }
}
