import request from "../utils/request";

const baseUrl = 'http://localhost:3030/snippets'

export default {
    async getAll() {
        const result = await request.get(baseUrl)

        const snippets = Object.values(result)

        return snippets;
    },
    getOne(snippetId) {
        return request.get(`${baseUrl}/${snippetId}`)
    },
    create(snippetData) {
        return request.post(baseUrl, snippetData)
    },
}