import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const baseUrl = 'http://localhost:3030/snippets';

export const useComments = (snippetId) => {
    const { request } = useAuth()
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        request.get(`${baseUrl}/${snippetId}/comments`)
            .then(data => {
                setComments(data)
                setIsLoading(false)
            })
            .catch(err => {
                setError(err)
                setIsLoading(false)
            })

    }, [snippetId])

    return {
        comments,
        isLoading,
        error
    }
}

export const useCreateComments = () => {
    const { request } = useAuth();

    const create = (snippetId, text, creator) => {
        const commentData = {
            text,
            creator,
        }

        return request.post(`${baseUrl}/${snippetId}/comments`, commentData)
    }

    return {
        create,
    }
}