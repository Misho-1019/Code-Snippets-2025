import { useEffect } from "react"
import { Navigate } from "react-router"
import { useLogout } from "../../api/authApi"

export default function Logout() {
    const { isLoggedOut, logout } = useLogout()

    useEffect(() => {
        logout()
    }, [])

    return isLoggedOut
        ? <Navigate to="/" />
        : null
}
