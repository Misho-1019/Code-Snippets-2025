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

        const likes = snippet.likes as any
        const hasLiked = likes.includes(userId)

        if (hasLiked) {
            likes.pull(userId)
        }
        else {
            likes.push(userId)
        }

        await snippet.save()

        return {
            likesCount: snippet.likes.length,
            likedByUser: !hasLiked,
        }
    }
}
