import { Link, useNavigate } from "react-router";
import { useLogin } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";

const schema = yup.object({
    email: yup.string().email('Invalid email format!').required('Email is required!'),
    password: yup.string().min(6, 'Password must be at least 6 characters!').required('Password is required!'),
})

interface LoginForm {
    email: string
    password: string
}

export default function Login() {
    const navigate = useNavigate();
    const { login } = useLogin();
    const { userLoginHandler } = useUserContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: yupResolver(schema),
    })

    const loginHandler = async (data: LoginForm) => {
        try {
            const authData = await login(data.email, data.password)
            userLoginHandler(authData)
            showToast('Successful login!', 'success')
            navigate('/')
        } catch (error) {
            showToast((error as Error).message, 'error')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-900 px-4 py-12">
            <div className="w-full max-w-md bg-white dark:bg-surface-800 p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Login to Your Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit(loginHandler)} noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" aria-describedby={errors.email ? 'email-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('email')} placeholder="Email..." />
                        {errors.email && (<p id="email-error" className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" aria-describedby={errors.password ? 'password-error' : undefined} className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" {...register('password')} placeholder="Password..." />
                        {errors.password && (<p id="password-error" className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
                    </div>
                    <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </main>
    );
}
