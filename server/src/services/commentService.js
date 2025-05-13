import Comment from "../models/Comment.js"

export default {
    getAllComments(snippetId) {
        return Comment.find({snippetId})
    },
    async createComment(snippetId, commentData) {
        const newComment = await Comment.create({
            ...commentData,
            snippetId: snippetId,
        })

        return newComment;
    },
    deleteComment(commentId) {
        return Comment.findByIdAndDelete(commentId)
    },
}