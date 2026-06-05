import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useRegister } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";

const schema = yup.object({
    username: yup.string().min(2, 'Username must be at least 2 characters').required('Username is required!'),
    email: yup.string().email('Invalid email format!').required('Email is required!'),
    password: yup.string().min(6, 'Password must be at least 6 characters!').required('Password is required!'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password must match!').required('Confirm password is required!'),
})

interface RegisterForm {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useRegister()
    const { userLoginHandler } = useUserContext()

    useEffect(() => {
        document.title = 'Register — Code Snippet'
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: yupResolver(schema),
    })

    const registerHandler = async ({ username, email, password }: RegisterForm) => {
        try {
            const authData = await registerUser(username, email, password)
            userLoginHandler(authData)
            showToast('Successful registration!', 'success')
            navigate('/')
        } catch (error) {
            showToast((error as Error).message, 'error')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="w-full max-w-md bg-white dark:bg-surface-800 p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Create an Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit(registerHandler)} noValidate>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input type="text" id="username" aria-describedby={errors.username ? 'username-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('username')} placeholder="Username..." />
                        {errors.username && (<p id="username-error" className="text-red-500 text-sm mt-1">{errors.username.message}</p>)}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" id="email" aria-describedby={errors.email ? 'email-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('email')} placeholder="Email..." />
                        {errors.email && (<p id="email-error" className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" id="password" aria-describedby={errors.password ? 'password-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('password')} placeholder="Password..." />
                        {errors.password && (<p id="password-error" className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repeat Password</label>
                        <input type="password" id="confirmPassword" aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('confirmPassword')} placeholder="Repeat password..." />
                        {errors.confirmPassword && (<p id="confirmPassword-error" className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>)}
                    </div>
                    <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 active:scale-95 transition" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </main>
    );
}
