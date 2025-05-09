import { useEffect, useState } from "react"
import request from "../utils/request"
import useAuth from "../hooks/useAuth"

const baseUrl = 'http://localhost:3030/snippets'

export const useSnippets = () => {
    const [snippets, setSnippets] = useState([])

    useEffect(() => {
        request.get(baseUrl)
            .then(res => setSnippets(res.snippets))
    }, [])

    return {
        snippets,
    }
}

export const useSnippet = (snippetId) => {
    const [snippet, setSnippet] = useState({})

    useEffect(() => {
        request.get(`${baseUrl}/${snippetId}`)
            .then(setSnippet)
    }, [snippetId])

    return {
        snippet,
    }
}

export const useCreateSnippet = () => {
    const { request } = useAuth()

    const create = (snippetData) => 
        request.post(`${baseUrl}/create`, snippetData)

    return {
        create,
    }
}

export const useEditSnippet = () => {
    const { request } = useAuth();

    const edit = (snippetId, snippetData) => 
        request.put(`${baseUrl}/${snippetId}`, {...snippetData, _id: snippetId})

    return {
        edit,
    }
}

export const useDeleteSnippet = () => {
    const { request } = useAuth()

    const deleteSnippet = (snippetId) =>
        request.delete(`${baseUrl}/${snippetId}`)

    return {
        deleteSnippet,
    }
}