import Snippet from "../models/Snippet.js"

export default {
    getAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        return Snippet.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
    },
    getTotalCount() {
        return Snippet.countDocuments()
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
    updateSnippet(snippetData, snippetId) {
        return Snippet.findByIdAndUpdate(snippetId, snippetData)
    },
    deleteSnippet(snippetId) {
        return Snippet.findByIdAndDelete(snippetId)
    }
}