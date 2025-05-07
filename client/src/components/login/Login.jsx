import { useActionState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    email: yup.string().email('Invalid email format!').required('Email is required!'),
    password: yup.string().min(6, 'Password must be at least 6 characters!'),
})

export default function Login() {
    const navigate = useNavigate();
    const { login } = useLogin();
    const { userLoginHandler } = useUserContext()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const loginHandler = async (data) => {
        try {
            const authData = await login(data.email, data.password)

            userLoginHandler(authData)

            toast.success('Successful login!', {
                position: 'top-center',
                autoClose: 2000,
                theme: 'dark',
            })

            navigate('/')
        } catch (error) {
            toast.error(error.message || 'Login failed!', {
                position: 'top-center',
                autoClose: 2000,
                theme: 'dark',
            })
        }
    }

    // const loginHandler = async (_, formData) => {
    //     const values = Object.fromEntries(formData)

    //     const authData = await login(values.email, values.password)

    //     userLoginHandler(authData)

    //     navigate('/')
    // }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]

        if (firstError?.message) {
            toast.error(firstError.message, {
                position: 'top-center',
                autoClose: 2000,
                theme: 'dark',
            })
        }
    }

    // const [_, loginAction, isPending] = useActionState(loginHandler, { email: '', password: '' })

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit(loginHandler, onError)} noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('email')} placeholder="Email..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('password')} placeholder="Password..."/>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition" disabled={isSubmitting}>
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
