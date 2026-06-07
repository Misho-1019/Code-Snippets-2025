import { useEffect, useState, useRef } from "react"
import request from "../utils/request"
import useAuth from "../hooks/useAuth"
import type { Snippet, PaginatedResponse, LanguageCount, TagCount } from "../types"

const baseUrl = '/api/snippets'

export const useSnippets = (search?: string, language?: string, page?: number, tag?: string) => {
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        const abort = new AbortController()
        setIsLoading(true)
        setError(null)

        const params: Record<string, string> = {}
        if (search) params.search = search
        if (language) params.language = language
        if (page && page > 1) params.page = String(page)
        if (tag) params.tag = tag

        const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : ''

        request.get(baseUrl + qs, { signal: abort.signal })
            .then(res => {
                const data = res as PaginatedResponse
                setSnippets(data.snippets)
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage)
                setIsLoading(false)
            })
            .catch(err => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                console.error('useSnippets:', err)
                setError(err)
                setIsLoading(false)
            })

        return () => abort.abort()
    }, [search, language, page, tag])

    return { snippets, totalPages, currentPage, isLoading, error }
}

export const useLatestSnippets = () => {
    const [latestSnippets, setLatestSnippets] = useState<Snippet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)
    const abortRef = useRef<AbortController | null>(null)

    const fetchLatest = () => {
        abortRef.current?.abort()
        const abort = new AbortController()
        abortRef.current = abort
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/latest`, { signal: abort.signal })
            .then(data => {
                setLatestSnippets(data as Snippet[])
                setIsLoading(false)
            })
            .catch(err => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                console.error('useLatestSnippets:', err)
                setError(err)
                setIsLoading(false)
            })

        return abort
    }

    useEffect(() => {
        const abort = fetchLatest()
        return () => abort.abort()
    }, [])

    return { latestSnippets, isLoading, error, refetch: () => { fetchLatest() } }
}

export const useSnippet = (snippetId: string) => {
    const [snippet, setSnippet] = useState<Snippet | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        const abort = new AbortController()
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/${snippetId}`, { signal: abort.signal })
            .then(data => {
                setSnippet(data as Snippet)
                setIsLoading(false)
            })
            .catch(err => {
                if (err instanceof DOMException && err.name === 'AbortError') return
                setError(err)
                setIsLoading(false)
            })

        return () => abort.abort()
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
        authRequest.put(`${baseUrl}/${snippetId}`, snippetData)

    return { edit }
}

export const useDeleteSnippet = () => {
    const { request: authRequest } = useAuth()

    const deleteSnippet = (snippetId: string): Promise<unknown> =>
        authRequest.delete(`${baseUrl}/${snippetId}`)

    return { deleteSnippet }
}

export const useForkSnippet = () => {
    const { request: authRequest } = useAuth()

    const forkSnippet = (snippetId: string): Promise<unknown> =>
        authRequest.post(`${baseUrl}/${snippetId}/fork`)

    return { forkSnippet }
}

export const useLanguages = () => {
    const [languages, setLanguages] = useState<LanguageCount[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        request.get(`${baseUrl}/languages`)
            .then(data => {
                setLanguages(data as LanguageCount[])
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }, [])

    return { languages, isLoading }
}

export const useTags = () => {
    const [tags, setTags] = useState<TagCount[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        request.get(`${baseUrl}/tags`)
            .then(data => {
                setTags(data as TagCount[])
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }, [])

    return { tags, isLoading }
}
