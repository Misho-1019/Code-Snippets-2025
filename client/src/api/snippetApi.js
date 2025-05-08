import { useEffect, useState } from "react"
import { useUserContext } from "../context/UserContext"
import request from "../utils/request"

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
    edit(snippetId, snippetData) {
        return request.put(`${baseUrl}/${snippetId}`, {...snippetData, _id: snippetId})
    },
    delete(snippetId) {
        return request.delete(`${baseUrl}/${snippetId}`)
    },
}

export const useSnippets = () => {
    const [snippets, setSnippets] = useState([])

    useEffect(() => {
        request.get(baseUrl)
            .then(setSnippets)
    }, [])

    return {
        snippets,
    }
}

export const useCreateSnippet = () => {
    const { token } = useUserContext()

    const options = {
        headers: {
            'X-Authorization': token,
        }
    }

    const create = async (snippetData) => 
        await request.post(`${baseUrl}/create`, snippetData, options)

    return {
        create,
    }
}