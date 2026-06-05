import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function AuthGuard() {
    const { isAuthenticated, isAuthLoading } = useAuth()

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' />
    }

    return <Outlet />
}
