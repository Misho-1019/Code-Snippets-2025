import { Link, useNavigate } from "react-router";
import { useRegister } from "../../api/authApi";
import { useUserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";

const schema = yup.object({
    username: yup.string().required('Username is required!'),
    email: yup.string().email('Invalid email format!').required('Email is required!'),
    password: yup.string().min(6, 'Password must be at least 6 characters!'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password must match!').required('Confirm password is required!'),
})

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useRegister()
    const { userLoginHandler } = useUserContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const registerHandler = async ({ username, email, password }) => {
        try {
            const authData = await registerUser(username, email, password)

            userLoginHandler(authData)

            showToast('Successful registration!', 'success')

            navigate('/')
        } catch (error) {
            showToast(error.message, 'error')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit(registerHandler)} noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('username')} placeholder="Username..." />
                        {errors.username && (<p className="text-red-500 text-sm mt-1">{errors.username.message}</p>)}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('email')} placeholder="Email..." />
                        {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('password')} placeholder="Password..." />
                        {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repeat Password</label>
                        <input type="password" name="re-password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" {...register('confirmPassword')} placeholder="Repeat password..." />
                        {errors.confirmPassword && (<p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>)}
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition" disabled={isSubmitting}>
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
