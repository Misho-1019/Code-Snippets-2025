import Snippet from "../models/Snippet.js"

export default {
    getAll(page = 1, limit = 10, filter = {}) {
        const skip = (page - 1) * limit;

        const query = Snippet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

        return query;
    },
    getTotalCount(filter = {}) {
        return Snippet.countDocuments(filter)
    },
    getLatest({ sortBy, order, pageSize }) {
        const sortOrder = order === 'desc' ? -1 : 1;

        return Snippet.find()
            .sort({ [sortBy]: sortOrder })
            .limit(Number(pageSize))
            
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