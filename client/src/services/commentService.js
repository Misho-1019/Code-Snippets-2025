import request from "../utils/request";

const baseUrl = 'http://localhost:3030/snippets';

export default {
    async getAllComments(snippetId) {
        const comments = await request.get(`${baseUrl}/${snippetId}/comments`);

        const snippetComments = Object.values(comments).filter(comment => comment.snippetId === snippetId)

        return snippetComments
    },
    createComment(snippetId, creator, text) {
        return request.post(`${baseUrl}/${snippetId}/comments`, { text, creator })
    },
}