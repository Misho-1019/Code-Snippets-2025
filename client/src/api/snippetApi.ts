import { useEffect, useState } from "react"
import request from "../utils/request"
import useAuth from "../hooks/useAuth"
import type { Snippet, PaginatedResponse } from "../types"

const baseUrl = '/snippets'

export const useSnippets = (queryParams?: Record<string, string | number>) => {
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const params = queryParams ? '?' + new URLSearchParams(
            Object.entries(queryParams).map(([k, v]) => [k, String(v)])
        ).toString() : ''

        request.get(baseUrl + params)
            .then(res => {
                const data = res as PaginatedResponse
                setSnippets(data.snippets)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [queryParams])

    return { snippets, isLoading, error }
}

export const useLatestSnippets = () => {
    const [latestSnippets, setLatestSnippets] = useState<Snippet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/latest`)
            .then(data => {
                setLatestSnippets(data as Snippet[])
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [])

    return { latestSnippets, isLoading, error }
}

export const useSnippet = (snippetId: string) => {
    const [snippet, setSnippet] = useState<Snippet | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/${snippetId}`)
            .then(data => {
                setSnippet(data as Snippet)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [snippetId])

    return { snippet, isLoading, error }
}

export const useCreateSnippet = () => {
    const { request: authRequest } = useAuth()

    const create = (snippetData: Record<string, string>): Promise<unknown> =>
        authRequest.post(`${baseUrl}/create`, snippetData)

    return { create }
}

export const useEditSnippet = () => {
    const { request: authRequest } = useAuth()

    const edit = (snippetId: string, snippetData: Record<string, string>): Promise<unknown> =>
        authRequest.put(`${baseUrl}/${snippetId}`, { ...snippetData, _id: snippetId })

    return { edit }
}

export const useDeleteSnippet = () => {
    const { request: authRequest } = useAuth()

    const deleteSnippet = (snippetId: string): Promise<unknown> =>
        authRequest.delete(`${baseUrl}/${snippetId}`)

    return { deleteSnippet }
}
