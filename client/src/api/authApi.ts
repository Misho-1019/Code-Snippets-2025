import { useContext, useEffect } from "react"
import request from "../utils/request"
import { UserContext } from "../context/UserContext";
import type { AuthData } from "../types";

const baseUrl = '/auth'

export const useLogin = () => {
    const login = async (email: string, password: string): Promise<AuthData> => {
        const result = await request.post(`${baseUrl}/login`, { email, password })
        return result as AuthData
    }

    return { login }
}

export const useRegister = () => {
    const register = (username: string, email: string, password: string): Promise<AuthData> =>
        request.post(`${baseUrl}/register`, { username, email, password }) as Promise<AuthData>

    return { register }
}

export const useLogout = () => {
    const { email, userLogoutHandler } = useContext(UserContext);

    useEffect(() => {
        if (!email) return;

        const abort = new AbortController()

        request.get(`${baseUrl}/logout`, { signal: abort.signal })
            .then(() => userLogoutHandler())
            .catch(err => {
                if (err instanceof DOMException && err.name === 'AbortError') return
            })

        return () => abort.abort()
    }, [email])

    return { isLoggedOut: !email }
}
