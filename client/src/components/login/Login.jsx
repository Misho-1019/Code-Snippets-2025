import { Link, useNavigate } from "react-router";

export default function Login({
    onLogin,
}) {
    const navigate = useNavigate();

    const loginAction = (formData) => {
        const email = formData.get('email')

        onLogin(email)

        navigate('/')
    }
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>
                <form className="space-y-4" action={loginAction}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
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
