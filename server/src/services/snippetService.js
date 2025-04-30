import Snippet from "../models/Snippet.js"

export default {
    getAll() {
        return Snippet.find({})
    },
    getOne(snippetId) {
        return Snippet.findById(snippetId)
    },
    createSnippet(snippetData, creatorId) {
        const result = Snippet.create({
            ...snippetData,
            creator: creatorId,
        })

        return result;
    },
