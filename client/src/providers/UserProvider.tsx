import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "../context/UserContext";
import request from "../utils/request";
import type { AuthData } from "../types";

const initialAuthState: AuthData = {
    _id: '',
    email: '',
    username: '',
    token: '',
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [authData, setAuthData] = useState<AuthData>(initialAuthState)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    useEffect(() => {
        request.get('/api/auth/me')
            .then(data => {
                const user = data as { _id: string; email: string; username: string }
                setAuthData({ ...user, token: '' })
            })
            .catch(() => {
                setAuthData(initialAuthState)
            })
            .finally(() => {
                setIsAuthLoading(false)
            })
    }, [])

    const userLoginHandler = (resultData: AuthData): void => {
        setAuthData({ ...resultData, token: '' })
    }

    const userLogoutHandler = (): void => {
        setAuthData(initialAuthState)
    }

    return (
        <UserContext.Provider value={{ ...authData, isAuthLoading, userLoginHandler, userLogoutHandler }}>
            {children}
        </UserContext.Provider>
    )
}
