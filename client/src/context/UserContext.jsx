import { createContext, useContext } from "react";

export const UserContext = createContext({
    id: '',
    email: '',
    username: '',
    token: '',
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
})

export function useUserContext() {
    const data = useContext(UserContext)

    return data;
}