import { useContext, useEffect, useRef } from "react"
import request from "../utils/request"
import { UserContext } from "../context/UserContext";
import type { AuthData } from "../types";

const baseUrl = 'http://localhost:3030/auth'

export const useLogin = () => {
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
    const { email, userLogoutHandler } = useContext(UserContext);

    useEffect(() => {
        if (!email) return;

        request.get(`${baseUrl}/logout`)
            .finally(userLogoutHandler)
    }, [email, userLogoutHandler])

    return { isLoggedOut: !email }
}
