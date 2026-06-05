import { useContext } from "react"
import request from "../utils/request"
import { UserContext } from "../context/UserContext";
import type { AuthData } from "../types";

const baseUrl = '/api/auth'

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

    const logout = async (): Promise<void> => {
        try {
            await request.get(`${baseUrl}/logout`)
            userLogoutHandler()
        } catch {
            // Logout is best-effort; clear auth state regardless
            userLogoutHandler()
        }
    }

    return { isLoggedOut: !email, logout }
}
