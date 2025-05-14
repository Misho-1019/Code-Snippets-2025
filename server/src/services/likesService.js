import Snippet from "../models/Snippet.js"

export default {
    async toggleLike(snippetId, userId) {
        const snippet = await Snippet.findById(snippetId)

        if (!snippet) {
            throw new Error('Snippet not found!')
        }

        const hasLiked = snippet.likes.includes(userId)

        if (hasLiked) {
            snippet.likes.pull(userId)
        }
        else {
            snippet.likes.push(userId)
        }

        await snippet.save()

        return {
            likesCount: snippet.likes.length,
            likedByUser: !hasLiked,
        }
    }
}