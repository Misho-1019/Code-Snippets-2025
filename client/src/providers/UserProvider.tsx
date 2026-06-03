import type { ReactNode } from "react";
import { UserContext } from "../context/UserContext";
import usePersistedState from "../hooks/usePersistedState";
import type { AuthData } from "../types";

export function UserProvider({ children }: { children: ReactNode }) {
    const [authData, setAuthData] = usePersistedState<AuthData | Record<string, never>>('auth', {})

    const userLoginHandler = (resultData: AuthData): void => {
        setAuthData(resultData)
    }

    const userLogoutHandler = (): void => {
        setAuthData({})
    }

    return (
        <UserContext.Provider value={{ ...authData as AuthData, userLoginHandler, userLogoutHandler }}>
            {children}
        </UserContext.Provider>
    )
}
