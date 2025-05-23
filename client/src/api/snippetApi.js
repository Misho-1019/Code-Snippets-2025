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

export const useLatestSnippets = () => {
    const [latestSnippets, setLatestSnippets] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/latest`)
            .then(data => {
                setLatestSnippets(data)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [])

    return {
        latestSnippets,
        isLoading,
        error,
    }
}

export const useSnippet = (snippetId) => {
    const [snippet, setSnippet] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/${snippetId}`)
            .then(data => {
                setSnippet(data)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [snippetId])

    return {
        snippet,
        isLoading,
        error,
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