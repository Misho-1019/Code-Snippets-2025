import { useActionState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../context/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useLogin();
    const { userLoginHandler } = useContext(UserContext)

    const loginHandler = async (_, formData) => {
        const values = Object.fromEntries(formData)

        const authData = await login(values.email, values.password)

        userLoginHandler(authData)

        navigate('/')
    }

    const [_, loginAction, isPending] = useActionState(loginHandler, { email: '', password: '' })

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>
                <form className="space-y-4" action={loginAction}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Email..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Password..."/>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition" disabled={isPending}>
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </main>
    );
}
