import useAuth from "../hooks/useAuth";
import type { LikeResult } from "../types";

const baseUrl = 'http://localhost:3030/snippets';

export const useToggleLike = () => {
    const { request: authRequest } = useAuth()

    const toggleLike = (snippetId: string): Promise<LikeResult> => {
        return authRequest.post(`${baseUrl}/${snippetId}/likes`) as Promise<LikeResult>
    }

    return { toggleLike }
}
