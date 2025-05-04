import { createContext } from "react";

export const UserContext = createContext({
    id: '',
    email: '',
    username: '',
    token: '',
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
})