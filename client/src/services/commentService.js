import request from "../utils/request";

const baseUrl = 'http://localhost:3030/snippets';

export default {
    createComment(snippetId, creator, text) {
        return request.post(`${baseUrl}/${snippetId}/comments`, { text, creator })
    },
}