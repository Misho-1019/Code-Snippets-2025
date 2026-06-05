import { createContext, useContext } from "react";
import type { UserContextType } from "../types";

export const UserContext = createContext<UserContextType>({
    _id: '',
    email: '',
    username: '',
    token: '',
    isAuthLoading: true,
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
})

export function useUserContext(): UserContextType {
    return useContext(UserContext)
}
