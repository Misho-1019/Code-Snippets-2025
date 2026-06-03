import { useContext, useEffect, useRef } from "react"
import request from "../utils/request"
import { UserContext } from "../context/UserContext";
import type { AuthData } from "../types";

const baseUrl = 'http://localhost:3030/auth'

export const useLogin = () => {
    const { token } = useContext(UserContext)
    const abortRef = useRef(new AbortController());

    const login = async (email: string, password: string): Promise<AuthData> => {
        const result = await request.post(`${baseUrl}/login`, { email, password }, { signal: abortRef.current.signal })
        return result as AuthData
    }

    useEffect(() => {
        const abortController = abortRef.current;
        return () => abortController.abort();
    }, [])

    return { login }
}

export const useRegister = () => {
    const register = (username: string, email: string, password: string): Promise<AuthData> =>
        request.post(`${baseUrl}/register`, { username, email, password }) as Promise<AuthData>

    return { register }
}

export const useLogout = () => {
    const { token, userLogoutHandler } = useContext(UserContext);

    useEffect(() => {
        if (!token) return;

        const options = {
            headers: { 'X-Authorization': token }
        }

        request.get(`${baseUrl}/logout`, null, options)
            .finally(userLogoutHandler)
    }, [token, userLogoutHandler])

    return { isLoggedOut: !!token }
}
