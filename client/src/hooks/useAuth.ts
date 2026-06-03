import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import request from "../utils/request";
import type { AuthData } from "../types";

interface AuthRequest {
    get: (url: string, data?: unknown, options?: Record<string, unknown>) => Promise<unknown>
    post: (url: string, data?: unknown, options?: Record<string, unknown>) => Promise<unknown>
    put: (url: string, data?: unknown, options?: Record<string, unknown>) => Promise<unknown>
    delete: (url: string, data?: unknown, options?: Record<string, unknown>) => Promise<unknown>
}

interface UseAuthReturn extends AuthData {
    userId: string
    isAuthenticated: boolean
    request: AuthRequest
}

export default function useAuth(): UseAuthReturn {
    const authData = useContext(UserContext)

    const requestWrapper = (method: string, url: string, data?: unknown, options: Record<string, unknown> = {}): Promise<unknown> => {
        const optionWrapper = {
            ...options,
            headers: {
                'X-Authorization': authData.token,
                ...(options.headers as Record<string, string> || {}),
            }
        }

        return request.baseRequest(method as 'GET' | 'POST' | 'PUT' | 'DELETE', url, data, optionWrapper)
    }

    return {
        ...authData,
        userId: authData._id,
        isAuthenticated: !!authData.token,
        request: {
            get: requestWrapper.bind(null, 'GET'),
            post: requestWrapper.bind(null, 'POST'),
            put: requestWrapper.bind(null, 'PUT'),
            delete: requestWrapper.bind(null, 'DELETE'),
        }
    }
}
