import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import request from "../utils/request";
import type { Comment } from "../types";

const baseUrl = 'http://localhost:3030/snippets';

export const useComments = (snippetId: string) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/${snippetId}/comments`)
            .then(data => {
                setComments(data as Comment[])
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })

    }, [snippetId])

    return { comments, isLoading, error }
}

export const useCreateComments = () => {
    const { request: authRequest } = useAuth();

    const create = (snippetId: string, text: string): Promise<unknown> => {
        return authRequest.post(`${baseUrl}/${snippetId}/comments`, { text })
    }

    return { create }
}

export const useDeleteComment = () => {
    const { request: authRequest } = useAuth()

    const deleteComment = (snippetId: string, commentId: string): Promise<unknown> => {
        return authRequest.delete(`${baseUrl}/${snippetId}/comments/${commentId}`)
    }

    return { deleteComment }
}
