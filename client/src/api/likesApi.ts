import useAuth from "../hooks/useAuth";
import type { LikeResult } from "../types";

const baseUrl = '/api/snippets';

export const useToggleLike = () => {
    const { request: authRequest } = useAuth()

    const toggleLike = (snippetId: string): Promise<LikeResult> => {
        return authRequest.post(`${baseUrl}/${snippetId}/likes`) as Promise<LikeResult>
    }

    return { toggleLike }
}
