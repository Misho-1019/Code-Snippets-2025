import useAuth from "../hooks/useAuth";

const baseUrl = 'http://localhost:3030/snippets';

export const useToggleLike = () => {
    const { request } = useAuth()

    const toggleLike = (snippetId) => {
        return request.post(`${baseUrl}/${snippetId}/likes`)
    }

    return {
        toggleLike,
    }
}