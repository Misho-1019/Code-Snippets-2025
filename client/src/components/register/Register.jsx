import { Link, useNavigate } from "react-router";
import { useRegister } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister()
    const { userLoginHandler } = useUserContext()

    const registerHandler = async (formData) => {
        const values = Object.fromEntries(formData)

        const rePassword = formData.get('re-password')

        if (rePassword !== values.password) {
            console.log('Password mismatch!');
            
            return
        }

        const authData = await register(values.username, values.email, values.password)

        userLoginHandler(authData)
        
        navigate('/')
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
                <form className="space-y-4" action={registerHandler}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Username..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Email..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Password..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repeat Password</label>
                        <input type="password" name="re-password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" placeholder="Repeat password..."/>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                        Register
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </main>
    );
}
