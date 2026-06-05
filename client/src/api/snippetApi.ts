import { useEffect, useState } from "react"
import request from "../utils/request"
import useAuth from "../hooks/useAuth"
import type { Snippet, PaginatedResponse } from "../types"

const baseUrl = '/snippets'

export const useSnippets = (search?: string, language?: string, page?: number) => {
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const params: Record<string, string> = {}
        if (search) params.search = search
        if (language) params.language = language
        if (page && page > 1) params.page = String(page)

        const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : ''

        request.get(baseUrl + qs)
            .then(res => {
                const data = res as PaginatedResponse
                setSnippets(data.snippets)
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })
    }, [search, language, page])

    return { snippets, totalPages, currentPage, isLoading, error }
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
