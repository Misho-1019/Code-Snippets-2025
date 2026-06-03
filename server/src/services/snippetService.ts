import Snippet from "../models/Snippet.js"

export interface SnippetQuery {
    sortBy: string;
    order: string;
    pageSize: number;
}

export default {
    getAll(page = 1, limit = 10, filter: Record<string, string> = {}) {
        const skip = (page - 1) * limit;

        return Snippet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    },
    getTotalCount(filter: Record<string, string> = {}) {
        return Snippet.countDocuments(filter)
    },
    getLatest({ sortBy, order, pageSize }: SnippetQuery) {
        const sortOrder = order === 'desc' ? -1 : 1;

        return Snippet.find()
            .sort({ [sortBy]: sortOrder })
            .limit(Number(pageSize))
    },
    getOne(snippetId: string) {
        return Snippet.findById(snippetId)
    },
    createSnippet(snippetData: Record<string, unknown>, creatorId: string) {
        return Snippet.create({
            ...snippetData,
            creator: creatorId,
        })
    },
    updateSnippet(snippetData: Record<string, unknown>, snippetId: string) {
        return Snippet.findByIdAndUpdate(snippetId, snippetData)
    },
    deleteSnippet(snippetId: string) {
        return Snippet.findByIdAndDelete(snippetId)
    }
}
