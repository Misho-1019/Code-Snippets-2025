import Comment from "../models/Comment"

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
}