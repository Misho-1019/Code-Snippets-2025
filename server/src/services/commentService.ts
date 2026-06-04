import Comment from "../models/Comment.js"

export interface CommentData {
    text: string;
    creator: string;
}

export default {
    getAllComments(snippetId: string) {
        return Comment.find({snippetId}).populate('creator', 'username')
    },
    async createComment(snippetId: string, commentData: CommentData) {
        const newComment = await Comment.create({
            ...commentData,
            snippetId: snippetId,
        })

        return newComment;
    },
    deleteComment(commentId: string) {
        return Comment.findByIdAndDelete(commentId)
    },
    deleteBySnippetId(snippetId: string) {
        return Comment.deleteMany({ snippetId })
    },
}
